# Parametric Modeling plugin namespace.
module ParametricModeling

  #-------------------------------------------------------------------------------
  # Solid operations.
  #
  # Author: Julia Christina Eneroth
  # Copyright: 2018
  # License: MIT
  #-------------------------------------------------------------------------------
  module SolidOperations

    # Test if Group or Component is solid.
    #
    # If every edge in container binds an even number of faces the container is
    # considered solid. Nested containers are ignored.
    #
    # @param container [Sketchup::Group, Sketchup::ComponentInstance]
    #
    # @return [Boolean]
    def self.solid?(container)
      return false unless instance?(container)

      definition(container).entities.grep(Sketchup::Edge).all? { |e| e.faces.size.even? }
    end

    # Test if point is inside of container.
    #
    # @param point [Geom::Point3d] Point in the same coordinate system as the
    #   container, not its internal coordinate system.
    # @param container [Sketchup::Group, Sketchup::ComponentInstance]
    # @param on_boundary [Boolean] Value to return if point is on the boundary
    #   (surface) itself.
    # @param verify_solid [Boolean] Test whether container is a solid, and return
    #   false if it isn't. This test can be omitted if the container is known to
    #   be a solid.
    #
    # @return [Boolean]
    def self.within?(point, container, on_boundary = true, verify_solid = true)
      return false if verify_solid && !solid?(container)

      point = point.transform(container.transformation.inverse)

      # Cast ray from point and count how many times it intersect mesh to
      # determine what side it is on.
      vector = Geom::Vector3d.new(234, 1343, 345)
      ray = [point, vector]

      intersections = []

      definition(container).entities.grep(Sketchup::Face) do |face|
        return on_boundary if within_face?(point, face)

        intersection = Geom.intersect_line_plane(ray, face.plane)
        next unless intersection
        next if intersection == point

        # Check that intersection is on ray, and not in the other direction along
        # the line.
        next unless (intersection - point).samedirection?(vector)

        next unless within_face?(intersection, face)

        intersections << intersection
      end

      # Ray may have hit right on an edge, intersecting two adjacent faces, or
      # even a vertex and intersected many more.
      # Remove duplicated points.
      intersections = uniq_points(intersections)

      intersections.size.odd?
    end

    # Unite one container with another.
    #
    # @param target [Sketchup::Group, Sketchup::ComponentInstance]
    # @param modifier [Sketchup::Group, Sketchup::ComponentInstance]
    #
    # @return [Boolean, nil] `nil` denotes failure in algorithm. `false` denotes one
    #   of the containers wasn't a solid.
    def self.union(target, modifier)
      return false unless solid?(target) && solid?(modifier)
      target.make_unique if target.is_a?(Sketchup::Group)

      # Use a temporary copy of modifier instead of altering original.
      temp_group = target.parent.entities.add_group
      merge_into(temp_group, modifier)
      modifier = temp_group

      target_ents = definition(target).entities
      modifier_ents = definition(modifier).entities

      add_intersection_edges(target, modifier)

      # Keep references to edges binding overlapping faces so they can later be
      # removed and the faces merged. Use vertices as references as the edges are
      # deleted and replaced in merge_into.
      overlapping_edges = find_corresponding_faces(target, modifier, nil)[0].flat_map(&:edges).map(&:vertices)

      # Remove faces in both containers that are inside the other one's solid.
      # Remove faces that exists in both containers and have opposite orientation.
      erase1 = find_faces(target, modifier, true, false)
      erase2 = find_faces(modifier, target, true, false)
      c_faces1, c_faces2 = find_corresponding_faces(target, modifier, false)
      erase1.concat(c_faces1)
      erase2.concat(c_faces2)
      erase_faces_with_edges(erase1)
      erase_faces_with_edges(erase2)

      merge_into(target, modifier)

      # Merge faces between target and modifier by removing co-planar edges around
      # their overlapping faces.
      overlapping_edges.select! { |vs| vs.all?(&:valid?) }
      overlapping_edges.map! { |vs| vs[0].common_edge(vs[1]) }.compact!
      target_ents.erase_entities(find_coplanar_edges(overlapping_edges))

      weld_hack(target_ents)

      solid?(target) ? true : nil
    end

    # Subtract one container from another.
    #
    # @param target [Sketchup::Group, Sketchup::ComponentInstance]
    # @param modifier [Sketchup::Group, Sketchup::ComponentInstance]
    #
    # @return [Boolean, nil] `nil` denotes failure in algorithm. `false` denotes one
    #   of the containers wasn't a solid.
    def self.subtract(target, modifier)
      status = trim(target, modifier)
      return status unless status
      modifier.erase!

      true
    end

    # Trim one container from another.
    #
    # @param target [Sketchup::Group, Sketchup::ComponentInstance]
    # @param modifier [Sketchup::Group, Sketchup::ComponentInstance]
    #
    # @return [Boolean, nil] `nil` denotes failure in algorithm. `false` denotes one
    #   of the containers wasn't a solid.
    def self.trim(target, modifier)
      return false unless solid?(target) && solid?(modifier)
      target.make_unique if target.is_a?(Sketchup::Group)

      # Use a temporary copy of modifier instead of altering original.
      temp_group = target.parent.entities.add_group
      merge_into(temp_group, modifier, true)
      modifier = temp_group

      target_ents = definition(target).entities
      modifier_ents = definition(modifier).entities

      add_intersection_edges(target, modifier)

      # Keep references to edges binding overlapping faces so they can later be
      # removed and the faces merged. Use vertices as references as the edges are
      # deleted and replaced in merge_into.
      overlapping_edges = find_corresponding_faces(target, modifier, nil)[0].flat_map(&:edges).map(&:vertices)

      # Remove faces in target that are inside the modifier and faces in
      # modifier that are outside target.
      # Remove faces that exists in both containers and have opposite orientation.
      erase1 = find_faces(target, modifier, true, false)
      erase2 = find_faces(modifier, target, false, false)
      c_faces1, c_faces2 = find_corresponding_faces(target, modifier, true)
      erase1.concat(c_faces1)
      erase2.concat(c_faces2)
      erase_faces_with_edges(erase1)
      erase_faces_with_edges(erase2)

      modifier_ents.each { |f| f.reverse! if f.is_a? Sketchup::Face }
      merge_into(target, modifier)

      # Merge faces between target and modifier by removing co-planar edges around
      # their overlapping faces.
      overlapping_edges.select! { |vs| vs.all?(&:valid?) }
      overlapping_edges.map! { |vs| vs[0].common_edge(vs[1]) }.compact!
      target_ents.erase_entities(find_coplanar_edges(overlapping_edges))

      weld_hack(target_ents)

      solid?(target) ? true : nil
    end

    # Intersect one container with another.
    #
    # @param target [Sketchup::Group, Sketchup::ComponentInstance]
    # @param modifier [Sketchup::Group, Sketchup::ComponentInstance]
    #
    # @return [Boolean, nil] `nil` denotes failure in algorithm. `false` denotes one
    #   of the containers wasn't a solid.
    def self.intersect(target, modifier)
      return false unless solid?(target) && solid?(modifier)
      target.make_unique if target.is_a?(Sketchup::Group)

      # Use a temporary copy of modifier instead of altering original.
      temp_group = target.parent.entities.add_group
      merge_into(temp_group, modifier)
      modifier = temp_group

      target_ents = definition(target).entities
      modifier_ents = definition(modifier).entities

      add_intersection_edges(target, modifier)

      # Keep references to edges binding overlapping faces so they can later be
      # removed and the faces merged. Use vertices as references as the edges are
      # deleted and replaced in merge_into.
      overlapping_edges = find_corresponding_faces(target, modifier, nil)[0].flat_map(&:edges).map(&:vertices)

      # Remove faces in both containers that are outside the other one's solid.
      # Remove faces that exists in both containers and have opposite orientation.
      erase1 = find_faces(target, modifier, false, false)
      erase2 = find_faces(modifier, target, false, false)
      c_faces1, c_faces2 = find_corresponding_faces(target, modifier, false)
      erase1.concat(c_faces1)
      erase2.concat(c_faces2)
      erase_faces_with_edges(erase1)
      erase_faces_with_edges(erase2)

      merge_into(target, modifier)

      # Merge faces between target and modifier by removing co-planar edges around
      # their overlapping faces.
      overlapping_edges.select! { |vs| vs.all?(&:valid?) }
      overlapping_edges.map! { |vs| vs[0].common_edge(vs[1]) }.compact!
      target_ents.erase_entities(find_coplanar_edges(overlapping_edges))

      weld_hack(target_ents)

      solid?(target) ? true : nil
    end

    #-----------------------------------------------------------------------------

    # Get definition used by instance.
    # For Versions before SU 2015 there was no Group#definition method.
    #
    # @param instance [Sketchup::ComponentInstance, Sketchup::Group, Sketchup::Image]
    #
    # @return [Sketchup::ComponentDefinition]
    def self.definition(instance)
      if instance.is_a?(Sketchup::ComponentInstance) ||
        (Sketchup.version.to_i >= 15 && instance.is_a?(Sketchup::Group))
        instance.definition
      else
        instance.model.definitions.find { |d| d.instances.include?(instance) }
      end
    end
    private_class_method :definition

    # Test if entity is either group or component instance.
    #
    # Since a group is a special type of component groups and component instances
    # can often be treated the same.
    #
    # @example
    #   # Show Information of the Selected Instance
    #   entity = Sketchup.active_model.selection.first
    #   if !entity
    #     puts "Selection is empty."
    #   elsif SkippyLib::LEntity.instance?(entity)
    #     puts "Instance's transformation is: #{entity.transformation}."
    #     puts "Instance's definition is: #{entity.definition}."
    #   else
    #     puts "Entity is not a group or component instance."
    #   end
    #
    # @param entity [Sketchup::Entity]
    #
    # @return [Boolean]
    def self.instance?(entity)
      entity.is_a?(Sketchup::Group) || entity.is_a?(Sketchup::ComponentInstance)
    end
    private_class_method :instance?

    # Remove duplicate points from array.
    #
    # Ruby's own `Array#uniq` don't remove duplicated points as they are regarded
    # separate objects, based on #eql? and #hash. Without modifying the SketchUp
    # API classes this method can remove duplicated points based on == comparison.
    #
    # @param points [Array<Geom::Point3d>]
    #
    # @return [Array<Geom::Point3d>]
    def self.uniq_points(points)
      points.reduce([]) { |a, p| a.any? { |p1| p1 == p } ? a : a << p }
    end
    private_class_method :uniq_points

    # Test if point is inside of a face.
    #
    # @param point [Geom::Point3d]
    # @param face [Sketchup::Face]
    # @param on_boundary [Boolean] Value to return if point is on the boundary
    #   (edge/vertex) of face.
    #
    # @return [Boolean]
    def self.within_face?(point, face, on_boundary = true)
      pc = face.classify_point(point)
      return on_boundary if [Sketchup::Face::PointOnEdge, Sketchup::Face::PointOnVertex].include?(pc)

      pc == Sketchup::Face::PointInside
    end
    private_class_method :within_face?

    # Intersect containers and place intersection edges in both containers.
    #
    # @param container1 [Sketchup::Group, Sketchup::ComponentInstance]
    # @param container2 [Sketchup::Group, Sketchup::ComponentInstance]
    #
    # @return [Void]
    def self.add_intersection_edges(container1, container2)
      entities1 = definition(container1).entities
      entities2 = definition(container2).entities

      # Intersect twice as the intersect method sometimes fails in getting edges
      # where faces overlap.
      temp_group = container1.parent.entities.add_group

      entities1.intersect_with(
        false,
        container1.transformation,
        temp_group.entities,
        IDENTITY,
        true,
        find_mesh_geometry(entities2)
      )
      entities2.intersect_with(
        false,
        container1.transformation.inverse,
        temp_group.entities,
        container1.transformation.inverse,
        true,
        find_mesh_geometry(entities1)
      )

      interior_hole_hack(merge_into(container1, temp_group, true).grep(Sketchup::Edge))
      interior_hole_hack(merge_into(container2, temp_group).grep(Sketchup::Edge))

      nil
    end
    private_class_method :add_intersection_edges

    # Find an arbitrary point at a face.
    #
    # @param face [Sketchup::Face]
    #
    # @return [Geom::Point3d, nil] nil is returned for zero area faces.
    def self.point_at_face(face)
      # Sometimes invalid faces gets created when intersecting.
      # These are removed when validity check run.
      return if face.area.zero?

      # PolygonMesh.polygon_points in rare situations return points on a line,
      # which would lead to a point on the edge boundary being returned rather
      # than one within face.
      index = 1
      begin
        points = face.mesh.polygon_points_at(index)
        index += 1
      end while points[0].on_line?(points[1], points[2])

      Geom.linear_combination(
        0.5,
        Geom.linear_combination(0.5, points[0], 0.5, points[1]),
        0.5,
        points[2]
      )
    end
    private_class_method :point_at_face

    # Find faces based on them being interior or exterior to reference container.
    #
    # @param scope [Sketchup::Group, Sketchup::ComponentInstance]
    # @param reference [Sketchup::Group, Sketchup::ComponentInstance]
    # @param interior [Boolean] Whether faces interior to reference or faces exterior
    #   to reference should be selected.
    # @param on_surface [Boolean] I can't remember what this does, besides giving
    #   me a headache.
    #
    # @return [Array<Sketchup::Face>]
    def self.find_faces(scope, reference, interior, on_surface)
      definition(scope).entities.select do |f|
        next unless f.is_a?(Sketchup::Face)
        point = point_at_face(f)
        next unless point
        point.transform!(scope.transformation)
        next if interior != within?(point, reference, interior == on_surface, false)

        true
      end
    end
    private_class_method :find_faces

    # Find pairs of faces duplicated between containers.
    #
    # @param container1 [Sketchup::Group, Sketchup::ComponentInstance]
    # @param container2 [Sketchup::Group, Sketchup::ComponentInstance]
    # @param orientation [Boolean, nil] True only returns faces with same
    #   orientation, false only returns faces with opposite orientation and nil
    #   skips orientation check.
    #
    # @return [Array(Array<Sketchup::Face>, Array<Sketchup::Face>)] First array is
    #   from container1, second one is from container2.
    def self.find_corresponding_faces(container1, container2, orientation)
      faces = [[], []]

      definition(container1).entities.grep(Sketchup::Face) do |face1|
        normal1 = transform_as_normal(face1.normal, container1.transformation)
        points1 = face1.vertices.map { |v| v.position.transform(container1.transformation) }
        definition(container2).entities.grep(Sketchup::Face) do |face2|
          next unless face2.is_a?(Sketchup::Face)
          normal2 = transform_as_normal(face2.normal, container2.transformation)
          next unless normal1.parallel?(normal2)
          points2 = face2.vertices.map { |v| v.position.transform(container2.transformation) }
          next unless points1.all? { |v| points2.include?(v) }
          unless orientation.nil?
            next if normal1.samedirection?(normal2) != orientation
          end

          faces[0] << face1
          faces[1] << face2
        end
      end

      faces
    end
    private_class_method :find_corresponding_faces

    # Remove all edges binding less than 2 edges.
    #
    # @param entities [Sketchup::Entities]
    #
    # @return [Void]
    def self.purge_edges(entities)
      # REVIEW: Why 2 faces? Why not purge free standing edges only?
      # Are there cases where edges are left binding a single face?

      to_purge = entities.grep(Sketchup::Edge).select { |e| e.faces.size < 2 }
      entities.erase_entities(to_purge)

      nil
    end
    private_class_method :purge_edges

    # Move content of one container into another.
    #
    # Attributes of the to_move container, such as material and layer are not
    # carried over with its content.
    # Requires containers to be in the same drawing context.
    #
    # @param destination [Sketchup::Group, Sketchup::ComponentInstance]
    # @param to_move [Sketchup::Group, Sketchup::ComponentInstance]
    # @param keep_original [Boolean]
    #
    # @return [Array<Entity>]
    def self.merge_into(destination, to_move, keep_original = false)
      tr = destination.transformation.inverse * to_move.transformation
      entities = definition(destination).entities
      temp = entities.add_instance(definition(to_move), tr)
      to_move.erase! unless keep_original

      temp.explode
    end
    private_class_method :merge_into

    # Find coplanar edges with same material and layers on both sides.
    #
    # Stray edges included.
    #
    # @param entities [Sketchup::Entities]
    #
    # @return [Array<Sketchup::Edge>]
    def self.find_coplanar_edges(entities)
      entities.grep(Sketchup::Edge).select do |e|
        next unless e.faces.size == 2
        next unless e.faces[0].material == e.faces[1].material
        next unless e.faces[0].layer == e.faces[1].layer

        # This check gives false positive on very small angles.
        next unless e.faces[0].normal.parallel?(e.faces[1].normal)

        # This check gives false positive if one face is very narrow, and all its
        # points are almost on the plane of the other face, despite a small angle
        # in between.
        # Compare points of both faces to the other face's plane to reduce risk of
        # false positive.
        e.faces[0].vertices.all? do |v|
          e.faces[1].classify_point(v.position) != Sketchup::Face::PointNotOnPlane
        end
        e.faces[1].vertices.all? do |v|
          e.faces[0].classify_point(v.position) != Sketchup::Face::PointNotOnPlane
        end
      end
    end
    private_class_method :find_coplanar_edges

    # Weld overlapping edges.
    #
    # Sometimes SketchUp fails to weld these.
    #
    # @param entities [Sketchup::Entities]
    #
    # @return [Void]
    def self.weld_hack(entities)
      return if solid?(entities.parent)

      temp_group = entities.add_group
      naked_edges(entities).each do |e|
        temp_group.entities.add_line(e.start, e.end)
      end
      temp_group.explode

      nil
    end
    private_class_method :weld_hack

    # Find edges only binding one face.
    #
    # @param entities [Sketchup::Entities]
    #
    # @return [Array<Sketchup::Edge>]
    def self.naked_edges(entities)
      entities.grep(Sketchup::Edge).select { |e| e.faces.size == 1 }
    end
    private_class_method :naked_edges

    # Erase faces along with their binding edges that doesn't bind any other
    # faces.
    #
    # @param faces [Array<Face>]
    #
    # @return [Void]
    def self.erase_faces_with_edges(faces)
      return if faces.empty?
      erase = faces + (faces.flat_map(&:edges).select { |e| (e.faces - faces).empty? } )
      erase.first.parent.entities.erase_entities(erase)

      nil
    end

    # Find mesh geometry (edges and faces) in Entities collection.
    #
    # @param entities [Sketchup::Entities, Array<Entity>]
    #
    # @return [Array<Sketchup::Face, Sketchup::Edge>]
    def self.find_mesh_geometry(entities)
      entities.select { |e| [Sketchup::Face, Sketchup::Edge].include?(e.class) }
    end
    private_class_method :find_mesh_geometry

    # Return new vector transformed as a normal.
    #
    # Transforming a normal vector as a ordinary vector can give it a faulty
    # direction if the transformation is non-uniformly scaled or sheared. This
    # method assures the vector stays perpendicular to its perpendicular plane
    # when a transformation is applied.
    #
    # @param normal [Geom::Vector3d]
    # @param transformation [Geom::Transformation]
    #
    # @example
    #   # transform_as_normal VS native #transform
    #   skewed_tr = SkippyLib::LGeom::LTransformation.create_from_axes(
    #     ORIGIN,
    #     Geom::Vector3d.new(1, 0.3, 0),
    #     Geom::Vector3d.new(0, 1, 0),
    #     Geom::Vector3d.new(0, 0, 1)
    #   )
    #   normal = Y_AXIS
    #   puts "Transformed as vector: #{normal.transform(skewed_tr)}"
    #   puts "Transformed as normal: #{SkippyLib::LGeom::LVector3d.transform_as_normal(normal, skewed_tr)}"
    #
    # @return [Geom::Vector3d]
    def self.transform_as_normal(normal, transformation)
      tr = transpose(transformation).inverse

      normal.transform(tr).normalize
    end
    private_class_method :transform_as_normal

    # Transpose of 3X3 matrix (drop translation).
    #
    # @param transformation [Geom::Transformation]
    #
    # @return [Geom::Transformation]
    def self.transpose(transformation)
      a = transformation.to_a

      Geom::Transformation.new([
        a[0], a[4], a[8],  0,
        a[1], a[5], a[9],  0,
        a[2], a[6], a[10], 0,
        0,    0,    0,     a[15]
      ])
    end
    private_class_method :transpose

    # Form interior holes in faces from edges if possible.
    #
    # @param edges [Array<Edge>]
    #
    # @return [Void]
    def self.interior_hole_hack(edges)
      return if edges.empty?

      entities = edges.first.parent.entities
      old_entities = entities.to_a
      edges.each(&:find_faces)
      new_faces = entities.to_a - old_entities

      # Newly formed faces forming holes inside of other faces need to be kept for
      # the solid volume to be remained defined.
      # Some newly formed faces however are located where there was no face before,
      # and must thus be removed for the original volume to remain.
      # Even some new faces formed inside of other faces may be needed to be
      # removed, if there are already faces around the hole defining a
      # recess/bump.
      entities.erase_entities(new_faces.select { |f| !wrapping_face(f) || f.edges.any? { |e| e.faces.size != 2 } })

      nil
    end
    private_class_method :interior_hole_hack

    # Find the exterior face that a face forms a hole within, or nil if face isn't
    # inside another face.
    #
    # @param face [SketchUp::Face]
    #
    # @example
    #   ents = Sketchup.active_model.active_entities
    #   ents.add_face(
    #     Geom::Point3d.new(0,   0,   0),
    #     Geom::Point3d.new(0,   1.m, 0),
    #     Geom::Point3d.new(1.m, 1.m, 0),
    #     Geom::Point3d.new(1.m, 0,   0)
    #   )
    #   inner_face = ents.add_face(
    #     Geom::Point3d.new(0.25.m, 0.25.m, 0),
    #     Geom::Point3d.new(0.25.m, 0.75.m, 0),
    #     Geom::Point3d.new(0.75.m, 0.75.m, 0),
    #     Geom::Point3d.new(0.75.m, 0.25.m, 0)
    #   )
    #   outer_face = SkippyLib::LFace.wrapping_face(inner_face)
    #
    # @return [Sketchup::Face, nil]
    def self.wrapping_face(face)
      (face.edges.map(&:faces).inject(:&) - [face]).first
    end
    private_class_method :wrapping_face

  end

end

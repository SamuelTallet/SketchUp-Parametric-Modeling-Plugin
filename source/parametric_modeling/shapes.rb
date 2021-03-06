# Copyright 2014 Trimble Navigation Ltd.
# Copyright 2021 Samuel Tallet

# License: The MIT License (MIT)

require 'sketchup'
require 'parametric_modeling/number'

# Parametric Modeling plugin namespace.
module ParametricModeling

  # Helps to create 3D shapes.
  module Shapes

    # Creates a mix-in module that can be used to extend Geom::PolygonMesh
    # instances. These methods used to previously modify the base classes
    # themselves.
    module PolygonMeshHelper

      # Revolves edges defined by an array of points about an axis
      # pts is an Array of points
      # axis is an Array with a point and a vector
      # numsegments is the number of segments in the rotaion direction.
      def add_revolved_points(pts, axis, numsegments)

        # Make sure that there are enough points.
        numpts = pts.length
        if( numpts < 2 )
          raise ArgumentError, "At least two points required", caller
        end

        #TODO: Determine if the points are all in the same plane as the axis.
        planar = true

        # Create a transformation that will revolve the points.
        angle = Math::PI * 2
        da = angle / numsegments
        t = Geom::Transformation.rotation(axis[0], axis[1], da)

        # Add the points to the mesh.
        index_array = []
        for pt in pts do
          if( pt.on_line?(axis) )
            index_array.push( [self.add_point(pt)] )
          else
            indices = []
            for i in 0...numsegments do
              indices.push( self.add_point(pt) )
              #puts "add #{pt} at #{indices.last}"
              pt.transform!(t)
            end
            index_array.push indices
          end
        end

        # Now create polygons using the point indices.
        i1 = index_array[0]
        for i in 1...numpts do
          i2 = index_array[i]
          n1 = i1.length
          n2 = i2.length
          nest if( n1 < numsegments && n2 < numsegments )

          for j in 0...numsegments do
            jp1 = (j + 1) % numsegments
            if( n1 < numsegments )
              self.add_polygon i1[0], i2[jp1], i2[j]
              #puts "add_poly #{i1[0]}, #{i2[jp1]}, #{i2[j]}"
            elsif( n2 < numsegments )
              self.add_polygon i1[j], i1[jp1], i2[0]
              #puts "add_poly #{i1[j]}, #{i1[jp1]}, #{i2[0]}"
            else
              if( planar )
                self.add_polygon i1[j], i1[jp1], i2[jp1], i2[j]
              else
                # Try adding two triangles instead
                self.add_polygon i1[j], i1[jp1], i2[jp1]
                self.add_polygon i1[j], i2[jp1], i2[j]
              end
              #puts "add_poly #{i1[j]}, #{i1[jp1]}, #{i2[jp1]}, #{i2[j]}"
            end
          end

          i1 = i2
        end

      end

      # Extrudes points along an axis with a rotation.
      def add_extruded_points(pts, center, dir, angle, numsegments)

        # Make sure that there are enough points.
        numpts = pts.length
        if( numpts < 2 )
          raise ArgumentError, "At least two points required", caller
        end

        # Compute the transformation.
        vec = Geom::Vector3d.new dir
        distance = vec.length
        dz = distance / numsegments
        da = angle / numsegments
        vec.length = dz
        t = Geom::Transformation.translation vec
        r = Geom::Transformation.rotation center, dir, da
        tform = t * r

        # Add the points to the mesh.
        index_array = []
        for i in 0...numsegments do
          indices = []
          for pt in pts do
            indices.push( self.add_point(pt) )
            pt.transform!(tform)
          end
          index_array.push indices
        end

        # Now create polygons using the point indices.
        i1 = index_array[0]
        for i in 1...numsegments do
          i2 = index_array[i]

          for j in 0...numpts do
            k = (j+1) % numpts
            self.add_polygon -i1[j], i2[k], -i1[k]
            self.add_polygon i1[j], -i2[j], -i2[k]
          end

          i1 = i2
        end

      end

    end

    # Draws a box.
    #
    # @param [Length] width
    # @param [Length] depth
    # @param [Length] height
    # @param [String] name
    # @param [Sketchup::Material, nil] material
    # @param [Sketchup::Layer, nil] layer
    # @raise [ArgumentError]
    #
    # @return [Sketchup::Group] Group that contains box.
    def self.draw_box(width, depth, height, name, material, layer)

      raise ArgumentError, 'Width must be a Length.'\
        unless width.is_a?(Length)

      raise ArgumentError, 'Depth must be a Length.'\
        unless depth.is_a?(Length)

      raise ArgumentError, 'Height must be a Length.'\
        unless height.is_a?(Length)

      raise ArgumentError, 'Name must be a String.'\
        unless name.is_a?(String)

      raise ArgumentError, 'Material must be a Sketchup::Material or nil.'\
        unless material.is_a?(Sketchup::Material) || material.nil?

      raise ArgumentError, 'Layer must be a Sketchup::Layer or nil.'\
        unless layer.is_a?(Sketchup::Layer) || layer.nil?

      model = Sketchup.active_model

      group = model.entities.add_group
      group.set_attribute(CODE_NAME, 'isParametric', true)

      # Draw box.
      points = [[0,0,0], [width,0,0], [width,depth,0], [0,depth,0], [0,0,0]]
      base = group.entities.add_face points
      height = -height if base.normal.dot(Z_AXIS) < 0.0
      base.pushpull height

      group.name = name
      group.material = material
      group.layer = layer

      group

    end

    # Draws a prism.
    #
    # @param [Length] radius
    # @param [Length] height
    # @param [Integer] sides
    # @param [String] name
    # @param [Sketchup::Material, nil] material
    # @param [Sketchup::Layer, nil] layer
    # @param [Boolean] soft
    # @raise [ArgumentError]
    #
    # @return [Sketchup::Group] Group that contains prism.
    def self.draw_prism(radius, height, sides, name, material, layer, soft)

      raise ArgumentError, 'Radius must be a Length.'\
        unless radius.is_a?(Length)

      raise ArgumentError, 'Height must be a Length.'\
        unless height.is_a?(Length)

      raise ArgumentError, 'Sides must be an Integer.'\
        unless sides.is_a?(Integer)

      raise ArgumentError, 'Name must be a String.'\
        unless name.is_a?(String)

      raise ArgumentError, 'Material must be a Sketchup::Material or nil.'\
        unless material.is_a?(Sketchup::Material) || material.nil?

      raise ArgumentError, 'Layer must be a Sketchup::Layer or nil.'\
        unless layer.is_a?(Sketchup::Layer) || layer.nil?

      raise ArgumentError, 'Soft must be a Boolean.'\
        unless soft == true || soft == false

      model = Sketchup.active_model

      group = model.entities.add_group
      group.set_attribute(CODE_NAME, 'isParametric', true)

      # Draw prism.
      if soft
        edges = group.entities.add_circle ORIGIN, Z_AXIS, radius, sides
      else
        edges = group.entities.add_ngon ORIGIN, Z_AXIS, radius, sides
      end

      base = group.entities.add_face edges
      height = -height if base.normal.dot(Z_AXIS) < 0.0
      base.pushpull height

      group.name = name
      group.material = material
      group.layer = layer

      group

    end

    # Draws a tube.
    #
    # @param [Length] radius
    # @param [Length] thickness
    # @param [Length] height
    # @param [Integer] segments
    # @param [String] name
    # @param [Sketchup::Material, nil] material
    # @param [Sketchup::Layer, nil] layer
    # @raise [ArgumentError]
    #
    # @return [Sketchup::Group] Group that contains tube.
    def self.draw_tube(radius, thickness, height, segments, name, material, layer)

      raise ArgumentError, 'Radius must be a Length.'\
        unless radius.is_a?(Length)

      raise ArgumentError, 'Thickness must be a Length.'\
        unless thickness.is_a?(Length)

      raise ArgumentError, 'Height must be a Length.'\
        unless height.is_a?(Length)

      raise ArgumentError, 'Segments must be an Integer.'\
        unless segments.is_a?(Integer)

      raise ArgumentError, 'Name must be a String.'\
        unless name.is_a?(String)

      raise ArgumentError, 'Material must be a Sketchup::Material or nil.'\
        unless material.is_a?(Sketchup::Material) || material.nil?

      raise ArgumentError, 'Layer must be a Sketchup::Layer or nil.'\
        unless layer.is_a?(Sketchup::Layer) || layer.nil?

      # Set internal params.
      outer_radius = radius
      inner_radius = radius - thickness

      model = Sketchup.active_model

      group = model.entities.add_group
      group.set_attribute(CODE_NAME, 'isParametric', true)

      # Draw outer loop of tube.
      outer_edges = group.entities.add_circle(ORIGIN, Z_AXIS, outer_radius, segments)
      # Adds a face to the circle, to form the bottom of the tube.
      profile_face = group.entities.add_face(outer_edges)
      # Draw the inner loop of the tuby profile and remove the inner face.
      inner_edges = group.entities.add_circle(ORIGIN, Z_AXIS, inner_radius, segments)
      inner_face = inner_edges.first.faces.find { |face| face != profile_face }
      inner_face.erase!
      # Ensure the face is extruded upwards.
      profile_face.reverse! if profile_face.normal.samedirection?(Z_AXIS.reverse)
      # Extrude the profile into a tube.
      profile_face.pushpull(height)

      group.name = name
      group.material = material
      group.layer = layer

      group

    end

    # Draws a pyramid.
    #
    # @param [Length] radius
    # @param [Length] height
    # @param [Integer] sides
    # @param [String] name
    # @param [Sketchup::Material, nil] material
    # @param [Sketchup::Layer, nil] layer
    # @param [Boolean] soft
    # @raise [ArgumentError]
    #
    # @return [Sketchup::Group] Group that contains pyramid.
    def self.draw_pyramid(radius, height, sides, name, material, layer, soft)

      raise ArgumentError, 'Radius must be a Length.'\
        unless radius.is_a?(Length)

      raise ArgumentError, 'Height must be a Length.'\
        unless height.is_a?(Length)

      raise ArgumentError, 'Sides must be an Integer.'\
        unless sides.is_a?(Integer)

      raise ArgumentError, 'Name must be a String.'\
        unless name.is_a?(String)

      raise ArgumentError, 'Material must be a Sketchup::Material or nil.'\
        unless material.is_a?(Sketchup::Material) || material.nil?

      raise ArgumentError, 'Layer must be a Sketchup::Layer or nil.'\
        unless layer.is_a?(Sketchup::Layer) || layer.nil?

      raise ArgumentError, 'Soft must be a Boolean.'\
        unless soft == true || soft == false

      model = Sketchup.active_model

      group = model.entities.add_group
      group.set_attribute(CODE_NAME, 'isParametric', true)

      # Draw base and define apex point.
      edges = group.entities.add_ngon ORIGIN, Z_AXIS, radius, sides
      base = group.entities.add_face edges
      apex = [0,0,height]
      base_edges = base.edges

      # Create the sides.
      apex = [0,0,height]
      edge1 = nil
      edge2 = nil
      base_edges.each do |edge|
        edge2 = group.entities.add_line edge.start.position, apex
        edge2.soft = soft
        edge2.smooth = soft
        if edge1
          group.entities.add_face edge, edge2, edge1
        end
        edge1 = edge2
      end # do

      # Create the last side face.
      edge = base_edges[0]
      group.entities.add_face edge.start.position, edge.end.position, apex

      group.name = name
      group.material = material
      group.layer = layer

      group

    end

    # Draws a sphere.
    #
    # @param [Length] radius
    # @param [Integer] segments
    # @param [String] name
    # @param [Sketchup::Material, nil] material
    # @param [Sketchup::Layer, nil] layer
    # @raise [ArgumentError]
    #
    # @return [Sketchup::Group] Group that contains sphere.
    def self.draw_sphere(radius, segments, name, material, layer)

      raise ArgumentError, 'Radius must be a Length.'\
        unless radius.is_a?(Length)

      raise ArgumentError, 'Segments must be an Integer.'\
        unless segments.is_a?(Integer)

      raise ArgumentError, 'Name must be a String.'\
        unless name.is_a?(String)

      raise ArgumentError, 'Material must be a Sketchup::Material or nil.'\
        unless material.is_a?(Sketchup::Material) || material.nil?

      raise ArgumentError, 'Layer must be a Sketchup::Layer or nil.'\
        unless layer.is_a?(Sketchup::Layer) || layer.nil?

      # Set internal params.
      n90 = segments / 4
      smooth = 12

      model = Sketchup.active_model

      group = model.entities.add_group
      group.set_attribute(CODE_NAME, 'isParametric', true)

      # Compute a half circle.
      arcpts = []
      delta = 90.degrees/n90
      for i in -n90..n90 do
        angle = delta * i
        cosa = Math.cos(angle)
        sina = Math.sin(angle)
        arcpts.push(Geom::Point3d.new(radius*cosa, 0, radius*sina))
      end

      # Create a mesh and revolve the half circle.
      numpoly = n90*n90*4
      numpts = numpoly + 1
      mesh = Geom::PolygonMesh.new(numpts, numpoly)
      mesh.extend(PolygonMeshHelper)
      mesh.add_revolved_points(arcpts, [ORIGIN, Z_AXIS], n90*4)

      # Create faces from the mesh.
      group.entities.add_faces_from_mesh(mesh, smooth)

      group.name = name
      group.material = material
      group.layer = layer

      group

    end

    # Draws an unknown shape.
    #
    # @param [Array] points Points grouped by face or edge.
    # @param [String] name
    # @param [Sketchup::Material, nil] material
    # @param [Sketchup::Layer, nil] layer
    # @raise [ArgumentError]
    #
    # @return [Sketchup::Group] Group that contains shape.
    def self.draw_shape(points, name, material, layer)

      raise ArgumentError, 'Points must be an Array.'\
        unless points.is_a?(Array)

      raise ArgumentError, 'Name must be a String.'\
        unless name.is_a?(String)

      raise ArgumentError, 'Material must be a Sketchup::Material or nil.'\
        unless material.is_a?(Sketchup::Material) || material.nil?
  
      raise ArgumentError, 'Layer must be a Sketchup::Layer or nil.'\
        unless layer.is_a?(Sketchup::Layer) || layer.nil?

      group = Sketchup.active_model.entities.add_group
      group.set_attribute(CODE_NAME, 'isParametric', true)

      points.each do |entity_points|

        entity_points_in_inches = []

        entity_points.each do |entity_point|

          entity_points_in_inches.push([

            Number.to_ul(entity_point[0].to_f), # X
            Number.to_ul(entity_point[1].to_f), # Y
            Number.to_ul(entity_point[2].to_f)  # Z

          ])

        end

        if entity_points.size == 2
          group.entities.add_edges(entity_points_in_inches)
        elsif entity_points.size >= 3
          # FIXME: Sometimes, faces need to be reversed.
          group.entities.add_face(entity_points_in_inches)
        end

      end

      group.name = name
      group.material = material
      group.layer = layer

      group

    end

  end

end

# Parametric Modeling extension for SketchUp.
# Copyright: © 2021 Samuel Tallet <samuel.tallet arobase gmail.com>
# 
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3.0 of the License, or
# (at your option) any later version.
# 
# If you release a modified version of this program TO THE PUBLIC,
# the GPL requires you to MAKE THE MODIFIED SOURCE CODE AVAILABLE
# to the program's users, UNDER THE GPL.
# 
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
# General Public License for more details.
# 
# Get a copy of the GPL here: https://www.gnu.org/licenses/gpl.html

require 'sketchup'
require 'parametric_modeling/utils'
require 'parametric_modeling/shapes'
require 'parametric_modeling/group'

# Parametric Modeling plugin namespace.
module ParametricModeling

  module Node

    # Computes a node only one time.
    #
    # @param [Hash] node
    # @raise [ArgumentError]
    #
    # @raise [RuntimeError]
    #
    # @return [Hash]
    def self.compute_once(node)

      raise ArgumentError, 'Node must be a Hash.'\
        unless node.is_a?(Hash)

      return node[:computed_data] if node[:computed?]

      # Sometimes, data are stored in node itself.
      node[:computed_data][:input] = node[:data]

      if !node[:inputs].empty?

        node[:inputs].each do |node_input_key, node_input|

          node_input[:connections].each do |node_input_connection|

            connected_input_node_computed_data = compute_once(
              SESSION[:nodes][node_input_connection[:node].to_s.to_sym]
            )

            # Output of input node becomes input of current node.
            node[:computed_data][:input][node_input_key.to_sym] =\
              connected_input_node_computed_data[:output][
                node_input_connection[:output].to_sym
              ]

          end

        end

      end

      case node[:name]

      when 'Draw box'

        model = Sketchup.active_model

        if node[:computed_data][:input].key?(:width)
          width = Utils.num2ul(node[:computed_data][:input][:width].to_f)
        else
          width = Utils.num2ul(1.0)
        end

        if node[:computed_data][:input].key?(:depth)
          depth = Utils.num2ul(node[:computed_data][:input][:depth].to_f)
        else
          depth = Utils.num2ul(1.0)
        end

        if node[:computed_data][:input].key?(:height)
          height = Utils.num2ul(node[:computed_data][:input][:height].to_f)
        else
          height = Utils.num2ul(1.0)
        end

        if node[:computed_data][:input].key?(:name)
          name = node[:computed_data][:input][:name]
        else
          name = 'Box'
        end

        if node[:computed_data][:input].key?(:material) &&
          node[:computed_data][:input][:material].is_a?(String)
          material = model.materials[node[:computed_data][:input][:material]]
        else
          material = nil
        end

        if node[:computed_data][:input].key?(:layer) &&
          node[:computed_data][:input][:layer].is_a?(String)
          layer = model.layers[node[:computed_data][:input][:layer]]
        else
          layer = nil
        end

        groups = [Shapes.draw_box(width, depth, height, name, material, layer)]
        node[:computed_data][:output][:groups] = groups        

      when 'Draw prism'

        model = Sketchup.active_model

        if node[:computed_data][:input].key?(:radius)
          radius = Utils.num2ul(node[:computed_data][:input][:radius].to_f)
        else
          radius = Utils.num2ul(1.0)
        end

        if node[:computed_data][:input].key?(:height)
          height = Utils.num2ul(node[:computed_data][:input][:height].to_f)
        else
          height = Utils.num2ul(1.0)
        end

        if node[:computed_data][:input].key?(:sides)
          sides = node[:computed_data][:input][:sides].to_i
        else
          sides = 6
        end

        if node[:computed_data][:input].key?(:name)
          name = node[:computed_data][:input][:name]
        else
          name = 'Prism'
        end

        if node[:computed_data][:input].key?(:material) &&
          node[:computed_data][:input][:material].is_a?(String)
          material = model.materials[node[:computed_data][:input][:material]]
        else
          material = nil
        end

        if node[:computed_data][:input].key?(:layer) &&
          node[:computed_data][:input][:layer].is_a?(String)
          layer = model.layers[node[:computed_data][:input][:layer]]
        else
          layer = nil
        end

        groups = [Shapes.draw_prism(radius, height, sides, name, material, layer)]
        node[:computed_data][:output][:groups] = groups

      when 'Draw cylinder'

        model = Sketchup.active_model

        if node[:computed_data][:input].key?(:radius)
          radius = Utils.num2ul(node[:computed_data][:input][:radius].to_f)
        else
          radius = Utils.num2ul(1.0)
        end

        if node[:computed_data][:input].key?(:height)
          height = Utils.num2ul(node[:computed_data][:input][:height].to_f)
        else
          height = Utils.num2ul(2.0)
        end

        if node[:computed_data][:input].key?(:segments)
          segments = node[:computed_data][:input][:segments].to_i
        else
          segments = 48
        end

        if node[:computed_data][:input].key?(:name)
          name = node[:computed_data][:input][:name]
        else
          name = 'Cylinder'
        end

        if node[:computed_data][:input].key?(:material) &&
          node[:computed_data][:input][:material].is_a?(String)
          material = model.materials[node[:computed_data][:input][:material]]
        else
          material = nil
        end

        if node[:computed_data][:input].key?(:layer) &&
          node[:computed_data][:input][:layer].is_a?(String)
          layer = model.layers[node[:computed_data][:input][:layer]]
        else
          layer = nil
        end

        groups = [Shapes.draw_prism(radius, height, segments, name, material, layer)]
        node[:computed_data][:output][:groups] = groups

      when 'Draw pyramid'

        model = Sketchup.active_model

        if node[:computed_data][:input].key?(:radius)
          radius = Utils.num2ul(node[:computed_data][:input][:radius].to_f)
        else
          radius = Utils.num2ul(1.0)
        end

        if node[:computed_data][:input].key?(:height)
          height = Utils.num2ul(node[:computed_data][:input][:height].to_f)
        else
          height = Utils.num2ul(1.0)
        end

        if node[:computed_data][:input].key?(:sides)
          sides = node[:computed_data][:input][:sides].to_i
        else
          sides = 4
        end

        if node[:computed_data][:input].key?(:name)
          name = node[:computed_data][:input][:name]
        else
          name = 'Pyramid'
        end

        if node[:computed_data][:input].key?(:material) &&
          node[:computed_data][:input][:material].is_a?(String)
          material = model.materials[node[:computed_data][:input][:material]]
        else
          material = nil
        end

        if node[:computed_data][:input].key?(:layer) &&
          node[:computed_data][:input][:layer].is_a?(String)
          layer = model.layers[node[:computed_data][:input][:layer]]
        else
          layer = nil
        end

        groups = [Shapes.draw_pyramid(radius, height, sides, name, material, layer)]
        node[:computed_data][:output][:groups] = groups

      when 'Draw cone'

        model = Sketchup.active_model

        if node[:computed_data][:input].key?(:radius)
          radius = Utils.num2ul(node[:computed_data][:input][:radius].to_f)
        else
          radius = Utils.num2ul(1.0)
        end

        if node[:computed_data][:input].key?(:height)
          height = Utils.num2ul(node[:computed_data][:input][:height].to_f)
        else
          height = Utils.num2ul(2.0)
        end

        if node[:computed_data][:input].key?(:segments)
          segments = node[:computed_data][:input][:segments].to_i
        else
          segments = 48
        end

        if node[:computed_data][:input].key?(:name)
          name = node[:computed_data][:input][:name]
        else
          name = 'Cone'
        end

        if node[:computed_data][:input].key?(:material) &&
          node[:computed_data][:input][:material].is_a?(String)
          material = model.materials[node[:computed_data][:input][:material]]
        else
          material = nil
        end

        if node[:computed_data][:input].key?(:layer) &&
          node[:computed_data][:input][:layer].is_a?(String)
          layer = model.layers[node[:computed_data][:input][:layer]]
        else
          layer = nil
        end

        groups = [Shapes.draw_pyramid(radius, height, segments, name, material, layer)]
        node[:computed_data][:output][:groups] = groups

      when 'Draw sphere'

        model = Sketchup.active_model

        if node[:computed_data][:input].key?(:radius)
          radius = Utils.num2ul(node[:computed_data][:input][:radius].to_f)
        else
          radius = Utils.num2ul(1.0)
        end

        if node[:computed_data][:input].key?(:name)
          name = node[:computed_data][:input][:name]
        else
          name = 'Sphere'
        end

        if node[:computed_data][:input].key?(:material) &&
          node[:computed_data][:input][:material].is_a?(String)
          material = model.materials[node[:computed_data][:input][:material]]
        else
          material = nil
        end

        if node[:computed_data][:input].key?(:layer) &&
          node[:computed_data][:input][:layer].is_a?(String)
          layer = model.layers[node[:computed_data][:input][:layer]]
        else
          layer = nil
        end

        groups = [Shapes.draw_sphere(radius, name, material, layer)]
        node[:computed_data][:output][:groups] = groups
    
      when 'Number'

        if node[:computed_data][:input].key?(:number)
          number = node[:computed_data][:input][:number].to_f
        else
          number = 0.0
        end

        node[:computed_data][:output][:number] = number

      when 'Add'

        if node[:computed_data][:input].key?(:number1)
          number1 = node[:computed_data][:input][:number1].to_f
        else
          number1 = 0.0
        end

        if node[:computed_data][:input].key?(:number2)
          number2 = node[:computed_data][:input][:number2].to_f
        else
          number2 = 0.0
        end

        node[:computed_data][:output][:number] = number1 + number2

      when 'Subtract'

        if node[:computed_data][:input].key?(:number1)
          number1 = node[:computed_data][:input][:number1].to_f
        else
          number1 = 0.0
        end

        if node[:computed_data][:input].key?(:number2)
          number2 = node[:computed_data][:input][:number2].to_f
        else
          number2 = 0.0
        end

        node[:computed_data][:output][:number] = number1 - number2

      when 'Point'

        if node[:computed_data][:input].key?(:x)
          x = Utils.num2ul(node[:computed_data][:input][:x].to_f)
        else
          x = 0.0
        end

        if node[:computed_data][:input].key?(:y)
          y = Utils.num2ul(node[:computed_data][:input][:y].to_f)
        else
          y = 0.0
        end

        if node[:computed_data][:input].key?(:z)
          z = Utils.num2ul(node[:computed_data][:input][:z].to_f)
        else
          z = 0.0
        end

        node[:computed_data][:output][:point] = Geom::Point3d.new(x, y, z)

      when 'Vector'

        if node[:computed_data][:input].key?(:x)
          x = node[:computed_data][:input][:x].to_f
        else
          x = 0.0
        end

        if node[:computed_data][:input].key?(:y)
          y = node[:computed_data][:input][:y].to_f
        else
          y = 0.0
        end

        if node[:computed_data][:input].key?(:z)
          z = node[:computed_data][:input][:z].to_f
        else
          z = 0.0
        end

        node[:computed_data][:output][:vector] = Geom::Vector3d.new(x, y, z)

      when 'Push/Pull'

        if node[:computed_data][:input].key?(:groups) &&
          node[:computed_data][:input][:groups].is_a?(Array)

          if node[:computed_data][:input].key?(:distance)
            distance = Utils.num2ul(node[:computed_data][:input][:distance].to_f)
          else
            distance = Utils.num2ul(1.0)
          end
  
          initial_distance = distance
  
          if node[:computed_data][:input].key?(:direction)
            direction = node[:computed_data][:input][:direction]
          else
            direction = Geom::Vector3d.new(0, 0, 0)
          end

          node[:computed_data][:output][:groups] = []
          
          node[:computed_data][:input][:groups].each do |group|

            node[:computed_data][:output][:groups].push(
              Group.pushpull(group, distance, direction)
            )

            if node[:computed_data][:input].key?(:increment_distance) &&
              node[:computed_data][:input][:increment_distance] == true

              distance = (distance + initial_distance).to_l
              
            end

          end

        else
          node[:computed_data][:output][:groups] = nil
        end

      when 'Move'

        if node[:computed_data][:input].key?(:groups) &&
          node[:computed_data][:input][:groups].is_a?(Array)

          if node[:computed_data][:input].key?(:point)
            point = node[:computed_data][:input][:point]
          else
            point = Geom::Point3d.new(Utils.num2ul(1.0), 0.0, 0.0)
          end
  
          initial_point_x = point.x
          initial_point_y = point.y
          initial_point_z = point.z

          node[:computed_data][:output][:groups] = []
          
          node[:computed_data][:input][:groups].each do |group|

            node[:computed_data][:output][:groups].push(Group.move(group, point))

            point = Geom::Point3d.new(
              point.x + initial_point_x,
              point.y + initial_point_y,
              point.z + initial_point_z
            )

          end

        else
          node[:computed_data][:output][:groups] = nil
        end

      when 'Rotate'

        if node[:computed_data][:input].key?(:groups) &&
          node[:computed_data][:input][:groups].is_a?(Array)

          if node[:computed_data][:input].key?(:axis)
            axis = node[:computed_data][:input][:axis]
          else
            axis = Z_AXIS
          end

          if node[:computed_data][:input].key?(:angle)
            angle = node[:computed_data][:input][:angle].to_f
          else
            angle = 45.0
          end
  
          initial_angle = angle

          node[:computed_data][:output][:groups] = []
          
          node[:computed_data][:input][:groups].each do |group|

            if node[:computed_data][:input].key?(:center)
              center = node[:computed_data][:input][:center]
            else
              center = group.bounds.center
            end

            node[:computed_data][:output][:groups].push(
              Group.rotate(group, center, axis, angle)
            )

            angle = angle + initial_angle

          end

        else
          node[:computed_data][:output][:groups] = nil
        end

      when 'Scale'

        if node[:computed_data][:input].key?(:groups) &&
          node[:computed_data][:input][:groups].is_a?(Array)

          if node[:computed_data][:input].key?(:x_factor)
            x_factor = node[:computed_data][:input][:x_factor].to_f
          else
            x_factor = 2.0
          end

          if node[:computed_data][:input].key?(:y_factor)
            y_factor = node[:computed_data][:input][:y_factor].to_f
          else
            y_factor = 2.0
          end

          if node[:computed_data][:input].key?(:z_factor)
            z_factor = node[:computed_data][:input][:z_factor].to_f
          else
            z_factor = 2.0
          end
  
          initial_x_factor = x_factor
          initial_y_factor = y_factor
          initial_z_factor = z_factor

          node[:computed_data][:output][:groups] = []
          
          node[:computed_data][:input][:groups].each do |group|

            if node[:computed_data][:input].key?(:point)
              point = node[:computed_data][:input][:point]
            else
              point = group.bounds.center
            end

            node[:computed_data][:output][:groups].push(
              Group.scale(group, point, x_factor, y_factor, z_factor)
            )

            x_factor = x_factor + initial_x_factor
            y_factor = y_factor + initial_y_factor
            z_factor = z_factor + initial_z_factor

          end

        else
          node[:computed_data][:output][:groups] = nil
        end

      when 'Copy'

        if node[:computed_data][:input].key?(:groups) &&
          node[:computed_data][:input][:groups].is_a?(Array)

          if node[:computed_data][:input].key?(:copies)
            copies = node[:computed_data][:input][:copies].to_i
          else
            copies = 1
          end

          node[:computed_data][:output][:groups] = []
          
          node[:computed_data][:input][:groups].each do |group|

            node[:computed_data][:output][:groups].push(group)\
              if node[:computed_data][:input].key?(:output_original) &&
                node[:computed_data][:input][:output_original] == true

            copies.times do
              node[:computed_data][:output][:groups].push(Group.copy(group))
            end

          end

        else
          node[:computed_data][:output][:groups] = nil
        end

      else
        raise RuntimeError, 'Unsupported node.'
      end

      node[:computed?] = true

      node[:computed_data]
      
    end

  end

end

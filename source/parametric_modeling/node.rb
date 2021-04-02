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
require 'dentaku'
require 'parametric_modeling/node_error'
require 'parametric_modeling/utils'
require 'parametric_modeling/shapes'
require 'parametric_modeling/solid_operations'
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

        if node[:computed_data][:input].key?(:width) &&
          Utils.valid_num?(node[:computed_data][:input][:width])
          width = Utils.num2ul(node[:computed_data][:input][:width].to_f)
        else
          width = Utils.num2ul(1.0)
        end

        if node[:computed_data][:input].key?(:depth) &&
          Utils.valid_num?(node[:computed_data][:input][:depth])
          depth = Utils.num2ul(node[:computed_data][:input][:depth].to_f)
        else
          depth = Utils.num2ul(1.0)
        end

        if node[:computed_data][:input].key?(:height) &&
          Utils.valid_num?(node[:computed_data][:input][:height])
          height = Utils.num2ul(node[:computed_data][:input][:height].to_f)
        else
          height = Utils.num2ul(1.0)
        end

        if node[:computed_data][:input].key?(:name) &&
          node[:computed_data][:input][:name].is_a?(String)
          name = node[:computed_data][:input][:name]
        else
          name = 'Box'
        end

        if node[:computed_data][:input].key?(:material) &&
          node[:computed_data][:input][:material].is_a?(String) &&
          !node[:computed_data][:input][:material].empty?

          material = model.materials[node[:computed_data][:input][:material]]

          if material.nil?

            material = model.materials.add(node[:computed_data][:input][:material])
            material.color = Utils.rand_color

          end

        else
          material = nil
        end

        if node[:computed_data][:input].key?(:layer) &&
          node[:computed_data][:input][:layer].is_a?(String) &&
          !node[:computed_data][:input][:layer].empty?

          layer = model.layers[node[:computed_data][:input][:layer]]

          if layer.nil?
            layer = model.layers.add(node[:computed_data][:input][:layer])
          end

        else
          layer = nil
        end

        node[:computed_data][:output][:groups] = [
          Shapes.draw_box(width, depth, height, name, material, layer)
        ]

      when 'Draw prism'

        model = Sketchup.active_model

        if node[:computed_data][:input].key?(:radius) &&
          Utils.valid_num?(node[:computed_data][:input][:radius])
          radius = Utils.num2ul(node[:computed_data][:input][:radius].to_f)
        else
          radius = Utils.num2ul(1.0)
        end

        if node[:computed_data][:input].key?(:height) &&
          Utils.valid_num?(node[:computed_data][:input][:height])
          height = Utils.num2ul(node[:computed_data][:input][:height].to_f)
        else
          height = Utils.num2ul(1.0)
        end

        if node[:computed_data][:input].key?(:sides) &&
          Utils.valid_num?(node[:computed_data][:input][:sides])
          sides = node[:computed_data][:input][:sides].to_i
        else
          sides = 6
        end

        if node[:computed_data][:input].key?(:name) &&
          node[:computed_data][:input][:name].is_a?(String)
          name = node[:computed_data][:input][:name]
        else
          name = 'Prism'
        end

        if node[:computed_data][:input].key?(:material) &&
          node[:computed_data][:input][:material].is_a?(String) &&
          !node[:computed_data][:input][:material].empty?

          material = model.materials[node[:computed_data][:input][:material]]

          if material.nil?

            material = model.materials.add(node[:computed_data][:input][:material])
            material.color = Utils.rand_color

          end

        else
          material = nil
        end

        if node[:computed_data][:input].key?(:layer) &&
          node[:computed_data][:input][:layer].is_a?(String) &&
          !node[:computed_data][:input][:layer].empty?

          layer = model.layers[node[:computed_data][:input][:layer]]

          if layer.nil?
            layer = model.layers.add(node[:computed_data][:input][:layer])
          end

        else
          layer = nil
        end

        node[:computed_data][:output][:groups] = [
          Shapes.draw_prism(radius, height, sides, name, material, layer)
        ]

      when 'Draw cylinder'

        model = Sketchup.active_model

        if node[:computed_data][:input].key?(:radius) &&
          Utils.valid_num?(node[:computed_data][:input][:radius])
          radius = Utils.num2ul(node[:computed_data][:input][:radius].to_f)
        else
          radius = Utils.num2ul(1.0)
        end

        if node[:computed_data][:input].key?(:height) &&
          Utils.valid_num?(node[:computed_data][:input][:height])
          height = Utils.num2ul(node[:computed_data][:input][:height].to_f)
        else
          height = Utils.num2ul(2.0)
        end

        if node[:computed_data][:input].key?(:segments) &&
          Utils.valid_num?(node[:computed_data][:input][:segments])
          segments = node[:computed_data][:input][:segments].to_i
        else
          segments = 48
        end

        if node[:computed_data][:input].key?(:name) &&
          node[:computed_data][:input][:name].is_a?(String)
          name = node[:computed_data][:input][:name]
        else
          name = 'Cylinder'
        end

        if node[:computed_data][:input].key?(:material) &&
          node[:computed_data][:input][:material].is_a?(String) &&
          !node[:computed_data][:input][:material].empty?

          material = model.materials[node[:computed_data][:input][:material]]

          if material.nil?

            material = model.materials.add(node[:computed_data][:input][:material])
            material.color = Utils.rand_color

          end

        else
          material = nil
        end

        if node[:computed_data][:input].key?(:layer) &&
          node[:computed_data][:input][:layer].is_a?(String) &&
          !node[:computed_data][:input][:layer].empty?

          layer = model.layers[node[:computed_data][:input][:layer]]

          if layer.nil?
            layer = model.layers.add(node[:computed_data][:input][:layer])
          end

        else
          layer = nil
        end

        node[:computed_data][:output][:groups] = [
          Shapes.draw_prism(radius, height, segments, name, material, layer)
        ]

      when 'Draw pyramid'

        model = Sketchup.active_model

        if node[:computed_data][:input].key?(:radius) &&
          Utils.valid_num?(node[:computed_data][:input][:radius])
          radius = Utils.num2ul(node[:computed_data][:input][:radius].to_f)
        else
          radius = Utils.num2ul(1.0)
        end

        if node[:computed_data][:input].key?(:height) &&
          Utils.valid_num?(node[:computed_data][:input][:height])
          height = Utils.num2ul(node[:computed_data][:input][:height].to_f)
        else
          height = Utils.num2ul(1.0)
        end

        if node[:computed_data][:input].key?(:sides) &&
          Utils.valid_num?(node[:computed_data][:input][:sides])
          sides = node[:computed_data][:input][:sides].to_i
        else
          sides = 4
        end

        if node[:computed_data][:input].key?(:name) &&
          node[:computed_data][:input][:name].is_a?(String)
          name = node[:computed_data][:input][:name]
        else
          name = 'Pyramid'
        end

        if node[:computed_data][:input].key?(:material) &&
          node[:computed_data][:input][:material].is_a?(String) &&
          !node[:computed_data][:input][:material].empty?

          material = model.materials[node[:computed_data][:input][:material]]

          if material.nil?

            material = model.materials.add(node[:computed_data][:input][:material])
            material.color = Utils.rand_color

          end

        else
          material = nil
        end

        if node[:computed_data][:input].key?(:layer) &&
          node[:computed_data][:input][:layer].is_a?(String) &&
          !node[:computed_data][:input][:layer].empty?

          layer = model.layers[node[:computed_data][:input][:layer]]

          if layer.nil?
            layer = model.layers.add(node[:computed_data][:input][:layer])
          end

        else
          layer = nil
        end

        node[:computed_data][:output][:groups] = [
          Shapes.draw_pyramid(radius, height, sides, name, material, layer)
        ]

      when 'Draw cone'

        model = Sketchup.active_model

        if node[:computed_data][:input].key?(:radius) &&
          Utils.valid_num?(node[:computed_data][:input][:radius])
          radius = Utils.num2ul(node[:computed_data][:input][:radius].to_f)
        else
          radius = Utils.num2ul(1.0)
        end

        if node[:computed_data][:input].key?(:height) &&
          Utils.valid_num?(node[:computed_data][:input][:height])
          height = Utils.num2ul(node[:computed_data][:input][:height].to_f)
        else
          height = Utils.num2ul(2.0)
        end

        if node[:computed_data][:input].key?(:segments) &&
          Utils.valid_num?(node[:computed_data][:input][:segments])
          segments = node[:computed_data][:input][:segments].to_i
        else
          segments = 48
        end

        if node[:computed_data][:input].key?(:name) &&
          node[:computed_data][:input][:name].is_a?(String)
          name = node[:computed_data][:input][:name]
        else
          name = 'Cone'
        end

        if node[:computed_data][:input].key?(:material) &&
          node[:computed_data][:input][:material].is_a?(String) &&
          !node[:computed_data][:input][:material].empty?

          material = model.materials[node[:computed_data][:input][:material]]

          if material.nil?

            material = model.materials.add(node[:computed_data][:input][:material])
            material.color = Utils.rand_color

          end

        else
          material = nil
        end

        if node[:computed_data][:input].key?(:layer) &&
          node[:computed_data][:input][:layer].is_a?(String) &&
          !node[:computed_data][:input][:layer].empty?

          layer = model.layers[node[:computed_data][:input][:layer]]

          if layer.nil?
            layer = model.layers.add(node[:computed_data][:input][:layer])
          end

        else
          layer = nil
        end

        node[:computed_data][:output][:groups] = [
          Shapes.draw_pyramid(radius, height, segments, name, material, layer)
        ]

      when 'Draw sphere'

        model = Sketchup.active_model

        if node[:computed_data][:input].key?(:radius) &&
          Utils.valid_num?(node[:computed_data][:input][:radius])
          radius = Utils.num2ul(node[:computed_data][:input][:radius].to_f)
        else
          radius = Utils.num2ul(1.0)
        end

        if node[:computed_data][:input].key?(:name) &&
          node[:computed_data][:input][:name].is_a?(String)
          name = node[:computed_data][:input][:name]
        else
          name = 'Sphere'
        end

        if node[:computed_data][:input].key?(:material) &&
          node[:computed_data][:input][:material].is_a?(String) &&
          !node[:computed_data][:input][:material].empty?

          material = model.materials[node[:computed_data][:input][:material]]

          if material.nil?

            material = model.materials.add(node[:computed_data][:input][:material])
            material.color = Utils.rand_color

          end

        else
          material = nil
        end

        if node[:computed_data][:input].key?(:layer) &&
          node[:computed_data][:input][:layer].is_a?(String) &&
          !node[:computed_data][:input][:layer].empty?

          layer = model.layers[node[:computed_data][:input][:layer]]

          if layer.nil?
            layer = model.layers.add(node[:computed_data][:input][:layer])
          end

        else
          layer = nil
        end

        node[:computed_data][:output][:groups] = [
          Shapes.draw_sphere(radius, name, material, layer)
        ]

      when 'Draw shape'

        if node[:computed_data][:input].key?(:points) &&
          node[:computed_data][:input][:points].is_a?(Array)
          points = node[:computed_data][:input][:points]
        else
          raise NodeError.new('Points not found', node[:id])
        end

        if node[:computed_data][:input].key?(:name) &&
          node[:computed_data][:input][:name].is_a?(String)
          name = node[:computed_data][:input][:name]
        else
          name = 'Shape'
        end

        node[:computed_data][:output][:groups] = [Shapes.draw_shape(points, name)]
    
      when 'Number'

        if node[:computed_data][:input].key?(:number) &&
          Utils.valid_num?(node[:computed_data][:input][:number])
          number = node[:computed_data][:input][:number].to_f
        else
          number = 0.0
        end

        node[:computed_data][:output][:number] = number

      when 'Add'

        if node[:computed_data][:input].key?(:number1) &&
          Utils.valid_num?(node[:computed_data][:input][:number1])
          number1 = node[:computed_data][:input][:number1].to_f
        else
          number1 = 0.0
        end

        if node[:computed_data][:input].key?(:number2) &&
          Utils.valid_num?(node[:computed_data][:input][:number2])
          number2 = node[:computed_data][:input][:number2].to_f
        else
          number2 = 0.0
        end

        sum = number1 + number2
        sum = sum.round(2)

        node[:computed_data][:output][:number] = sum

      when 'Subtract'

        if node[:computed_data][:input].key?(:number1) &&
          Utils.valid_num?(node[:computed_data][:input][:number1])
          number1 = node[:computed_data][:input][:number1].to_f
        else
          number1 = 0.0
        end

        if node[:computed_data][:input].key?(:number2) &&
          Utils.valid_num?(node[:computed_data][:input][:number2])
          number2 = node[:computed_data][:input][:number2].to_f
        else
          number2 = 0.0
        end

        diff = number1 - number2
        diff = diff.round(2)

        node[:computed_data][:output][:number] = diff

      when 'Multiply'

        if node[:computed_data][:input].key?(:number1) &&
          Utils.valid_num?(node[:computed_data][:input][:number1])
          number1 = node[:computed_data][:input][:number1].to_f
        else
          number1 = 0.0
        end

        if node[:computed_data][:input].key?(:number2) &&
          Utils.valid_num?(node[:computed_data][:input][:number2])
          number2 = node[:computed_data][:input][:number2].to_f
        else
          number2 = 0.0
        end

        node[:computed_data][:output][:number] = number1 * number2

      when 'Divide'

        if node[:computed_data][:input].key?(:dividend) &&
          Utils.valid_num?(node[:computed_data][:input][:dividend])
          dividend = node[:computed_data][:input][:dividend].to_f
        else
          dividend = 0.0
        end

        if node[:computed_data][:input].key?(:divisor) &&
          Utils.valid_num?(node[:computed_data][:input][:divisor])
          divisor = node[:computed_data][:input][:divisor].to_f
        else
          divisor = 1.0
        end

        node[:computed_data][:output][:quotient] = dividend / divisor
        node[:computed_data][:output][:remainder] = dividend % divisor
        
      when 'Calculate'

        if node[:computed_data][:input].key?(:formula) &&
          node[:computed_data][:input][:formula].is_a?(String)

          formula = node[:computed_data][:input][:formula]

          if node[:computed_data][:input].key?(:a) &&
            Utils.valid_num?(node[:computed_data][:input][:a])
            a = node[:computed_data][:input][:a].to_f
          else
            a = 0.0
          end
  
          if node[:computed_data][:input].key?(:b) &&
            Utils.valid_num?(node[:computed_data][:input][:b])
            b = node[:computed_data][:input][:b].to_f
          else
            b = 0.0
          end
  
          if node[:computed_data][:input].key?(:c) &&
            Utils.valid_num?(node[:computed_data][:input][:c])
            c = node[:computed_data][:input][:c].to_f
          else
            c = 0.0
          end
  
          if node[:computed_data][:input].key?(:d) &&
            Utils.valid_num?(node[:computed_data][:input][:d])
            d = node[:computed_data][:input][:d].to_f
          else
            d = 0.0
          end
  
          if node[:computed_data][:input].key?(:e) &&
            Utils.valid_num?(node[:computed_data][:input][:e])
            e = node[:computed_data][:input][:e].to_f
          else
            e = 0.0
          end
  
          if node[:computed_data][:input].key?(:f) &&
            Utils.valid_num?(node[:computed_data][:input][:f])
            f = node[:computed_data][:input][:f].to_f
          else
            f = 0.0
          end

          if node[:computed_data][:input].key?(:g) &&
            Utils.valid_num?(node[:computed_data][:input][:g])
            g = node[:computed_data][:input][:g].to_f
          else
            g = 0.0
          end

          if node[:computed_data][:input].key?(:h) &&
            Utils.valid_num?(node[:computed_data][:input][:h])
            h = node[:computed_data][:input][:h].to_f
          else
            h = 0.0
          end

          if node[:computed_data][:input].key?(:i) &&
            Utils.valid_num?(node[:computed_data][:input][:i])
            i = node[:computed_data][:input][:i].to_f
          else
            i = 0.0
          end

          if node[:computed_data][:input].key?(:j) &&
            Utils.valid_num?(node[:computed_data][:input][:j])
            j = node[:computed_data][:input][:j].to_f
          else
            j = 0.0
          end

          if node[:computed_data][:input].key?(:k) &&
            Utils.valid_num?(node[:computed_data][:input][:k])
            k = node[:computed_data][:input][:k].to_f
          else
            k = 0.0
          end

          if node[:computed_data][:input].key?(:l) &&
            Utils.valid_num?(node[:computed_data][:input][:l])
            l = node[:computed_data][:input][:l].to_f
          else
            l = 0.0
          end

          calculator = Dentaku::Calculator.new({
            aliases: {
              roundup: ['ceil'],
              rounddown: ['floor']
            }
          })

          calculator.add_function(
            :rand, :numeric, ->(number1, number2) { rand(number1..number2) }
          )

          calculator_result = calculator.evaluate(
            formula, {
              a: a, b: b, c: c, d: d, e: e, f: f, g: g, h: h, i: i, j: j, k: k, l: l,
              pi: Math::PI
            }
          )
  
          raise NodeError.new('Incorrect formula: ' + formula, node[:id])\
            if calculator_result.nil?
  
          node[:computed_data][:output][:number] = calculator_result.to_f
  
        else
          node[:computed_data][:output][:number] = 0.0
        end

      when 'Point'

        if node[:computed_data][:input].key?(:x) &&
          Utils.valid_num?(node[:computed_data][:input][:x])
          x = Utils.num2ul(node[:computed_data][:input][:x].to_f)
        else
          x = 0.0
        end

        if node[:computed_data][:input].key?(:y) &&
          Utils.valid_num?(node[:computed_data][:input][:y])
          y = Utils.num2ul(node[:computed_data][:input][:y].to_f)
        else
          y = 0.0
        end

        if node[:computed_data][:input].key?(:z) &&
          Utils.valid_num?(node[:computed_data][:input][:z])
          z = Utils.num2ul(node[:computed_data][:input][:z].to_f)
        else
          z = 0.0
        end

        node[:computed_data][:output][:point] = Geom::Point3d.new(x, y, z)

      when 'Vector'

        if node[:computed_data][:input].key?(:x) &&
          Utils.valid_num?(node[:computed_data][:input][:x])
          x = node[:computed_data][:input][:x].to_f
        else
          x = 0.0
        end

        if node[:computed_data][:input].key?(:y) &&
          Utils.valid_num?(node[:computed_data][:input][:y])
          y = node[:computed_data][:input][:y].to_f
        else
          y = 0.0
        end

        if node[:computed_data][:input].key?(:z) &&
          Utils.valid_num?(node[:computed_data][:input][:z])
          z = node[:computed_data][:input][:z].to_f
        else
          z = 0.0
        end

        node[:computed_data][:output][:vector] = Geom::Vector3d.new(x, y, z)

      when 'Intersect solids'

        if node[:computed_data][:input].key?(:groups1) &&
          node[:computed_data][:input][:groups1].is_a?(Array) &&
          !node[:computed_data][:input][:groups1].empty? &&
          node[:computed_data][:input].key?(:groups2) &&
          node[:computed_data][:input][:groups2].is_a?(Array) &&
          !node[:computed_data][:input][:groups2].empty?

          status = SolidOperations.intersect(
            node[:computed_data][:input][:groups1].first,
            node[:computed_data][:input][:groups2].first
          )

          raise NodeError.new('Boolean intersect failed', node[:id])\
            unless status == true
          
          node[:computed_data][:output][:groups] = [
            node[:computed_data][:input][:groups1].first
          ]
          
        else
          node[:computed_data][:output][:groups] = []
        end

      when 'Unite solids'

        if node[:computed_data][:input].key?(:groups1) &&
          node[:computed_data][:input][:groups1].is_a?(Array) &&
          !node[:computed_data][:input][:groups1].empty? &&
          node[:computed_data][:input].key?(:groups2) &&
          node[:computed_data][:input][:groups2].is_a?(Array) &&
          !node[:computed_data][:input][:groups2].empty?

          status = SolidOperations.union(
            node[:computed_data][:input][:groups1].first,
            node[:computed_data][:input][:groups2].first
          )

          raise NodeError.new('Boolean union failed', node[:id])\
            unless status == true
          
          node[:computed_data][:output][:groups] = [
            node[:computed_data][:input][:groups1].first
          ]
          
        else
          node[:computed_data][:output][:groups] = []
        end

      when 'Subtract solids'

        if node[:computed_data][:input].key?(:groups1) &&
          node[:computed_data][:input][:groups1].is_a?(Array) &&
          !node[:computed_data][:input][:groups1].empty? &&
          node[:computed_data][:input].key?(:groups2) &&
          node[:computed_data][:input][:groups2].is_a?(Array) &&
          !node[:computed_data][:input][:groups2].empty?

          status = SolidOperations.subtract(
            node[:computed_data][:input][:groups1].first,
            node[:computed_data][:input][:groups2].first
          )

          raise NodeError.new('Boolean subtract failed', node[:id])\
            unless status == true
          
          node[:computed_data][:output][:groups] = [
            node[:computed_data][:input][:groups1].first
          ]
          
        else
          node[:computed_data][:output][:groups] = []
        end

      when 'Push/Pull'

        if node[:computed_data][:input].key?(:groups) &&
          node[:computed_data][:input][:groups].is_a?(Array) &&
          !node[:computed_data][:input][:groups].empty?

          if node[:computed_data][:input].key?(:distance) &&
            Utils.valid_num?(node[:computed_data][:input][:distance])
            distance = Utils.num2ul(node[:computed_data][:input][:distance].to_f)
          else
            distance = Utils.num2ul(1.0)
          end
  
          initial_distance = distance
  
          if node[:computed_data][:input].key?(:direction) &&
            node[:computed_data][:input][:direction].is_a?(Geom::Vector3d)
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
          node[:computed_data][:output][:groups] = []
        end

      when 'Move'

        if node[:computed_data][:input].key?(:groups) &&
          node[:computed_data][:input][:groups].is_a?(Array) &&
          !node[:computed_data][:input][:groups].empty?

          if node[:computed_data][:input].key?(:point) &&
            node[:computed_data][:input][:point].is_a?(Geom::Point3d)
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
          node[:computed_data][:output][:groups] = []
        end

      when 'Rotate'

        if node[:computed_data][:input].key?(:groups) &&
          node[:computed_data][:input][:groups].is_a?(Array) &&
          !node[:computed_data][:input][:groups].empty?

          if node[:computed_data][:input].key?(:axis)
            axis = node[:computed_data][:input][:axis]
          else
            axis = Z_AXIS
          end

          if node[:computed_data][:input].key?(:angle) &&
            Utils.valid_num?(node[:computed_data][:input][:angle])
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
          node[:computed_data][:output][:groups] = []
        end

      when 'Scale'

        if node[:computed_data][:input].key?(:groups) &&
          node[:computed_data][:input][:groups].is_a?(Array) &&
          !node[:computed_data][:input][:groups].empty?

          if node[:computed_data][:input].key?(:x_factor) &&
            Utils.valid_num?(node[:computed_data][:input][:x_factor])
            x_factor = node[:computed_data][:input][:x_factor].to_f
          else
            x_factor = 2.0
          end

          if node[:computed_data][:input].key?(:y_factor) &&
            Utils.valid_num?(node[:computed_data][:input][:y_factor])
            y_factor = node[:computed_data][:input][:y_factor].to_f
          else
            y_factor = 2.0
          end

          if node[:computed_data][:input].key?(:z_factor) &&
            Utils.valid_num?(node[:computed_data][:input][:z_factor])
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
          node[:computed_data][:output][:groups] = []
        end

      when 'Paint'

        if node[:computed_data][:input].key?(:groups) &&
          node[:computed_data][:input][:groups].is_a?(Array) &&
          !node[:computed_data][:input][:groups].empty?

          model = Sketchup.active_model

          if node[:computed_data][:input].key?(:material) &&
            node[:computed_data][:input][:material].is_a?(String) &&
            !node[:computed_data][:input][:material].empty?
  
            material = model.materials[node[:computed_data][:input][:material]]
  
            if material.nil?
  
              material = model.materials.add(node[:computed_data][:input][:material])
              material.color = Utils.rand_color
  
            end
  
          else
            material = nil
          end

          node[:computed_data][:output][:groups] = []
          
          node[:computed_data][:input][:groups].each do |group|

            group.material = material
            node[:computed_data][:output][:groups].push(group)

          end

        else
          node[:computed_data][:output][:groups] = []
        end

      when 'Copy'

        if node[:computed_data][:input].key?(:groups) &&
          node[:computed_data][:input][:groups].is_a?(Array) &&
          !node[:computed_data][:input][:groups].empty?

          if node[:computed_data][:input].key?(:copies) &&
            Utils.valid_num?(node[:computed_data][:input][:copies])
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
          node[:computed_data][:output][:groups] = []
        end

      when 'Select'

        if node[:computed_data][:input].key?(:groups) &&
          node[:computed_data][:input][:groups].is_a?(Array) &&
          !node[:computed_data][:input][:groups].empty? &&
          node[:computed_data][:input].key?(:query) &&
          node[:computed_data][:input][:query].is_a?(String)

          query = node[:computed_data][:input][:query]

          if node[:computed_data][:input].key?(:a) &&
            Utils.valid_num?(node[:computed_data][:input][:a])
            a = node[:computed_data][:input][:a].to_f
          else
            a = 0.0
          end
  
          if node[:computed_data][:input].key?(:b) &&
            Utils.valid_num?(node[:computed_data][:input][:b])
            b = node[:computed_data][:input][:b].to_f
          else
            b = 0.0
          end
  
          if node[:computed_data][:input].key?(:c) &&
            Utils.valid_num?(node[:computed_data][:input][:c])
            c = node[:computed_data][:input][:c].to_f
          else
            c = 0.0
          end
  
          if node[:computed_data][:input].key?(:d) &&
            Utils.valid_num?(node[:computed_data][:input][:d])
            d = node[:computed_data][:input][:d].to_f
          else
            d = 0.0
          end
  
          if node[:computed_data][:input].key?(:e) &&
            Utils.valid_num?(node[:computed_data][:input][:e])
            e = node[:computed_data][:input][:e].to_f
          else
            e = 0.0
          end
  
          if node[:computed_data][:input].key?(:f) &&
            Utils.valid_num?(node[:computed_data][:input][:f])
            f = node[:computed_data][:input][:f].to_f
          else
            f = 0.0
          end

          if node[:computed_data][:input].key?(:g) &&
            Utils.valid_num?(node[:computed_data][:input][:g])
            g = node[:computed_data][:input][:g].to_f
          else
            g = 0.0
          end

          if node[:computed_data][:input].key?(:h) &&
            Utils.valid_num?(node[:computed_data][:input][:h])
            h = node[:computed_data][:input][:h].to_f
          else
            h = 0.0
          end

          if node[:computed_data][:input].key?(:i) &&
            Utils.valid_num?(node[:computed_data][:input][:i])
            i = node[:computed_data][:input][:i].to_f
          else
            i = 0.0
          end

          if node[:computed_data][:input].key?(:j) &&
            Utils.valid_num?(node[:computed_data][:input][:j])
            j = node[:computed_data][:input][:j].to_f
          else
            j = 0.0
          end

          if node[:computed_data][:input].key?(:k) &&
            Utils.valid_num?(node[:computed_data][:input][:k])
            k = node[:computed_data][:input][:k].to_f
          else
            k = 0.0
          end

          if node[:computed_data][:input].key?(:l) &&
            Utils.valid_num?(node[:computed_data][:input][:l])
            l = node[:computed_data][:input][:l].to_f
          else
            l = 0.0
          end

          calculator = Dentaku::Calculator.new

          # Select queries use implicit boolean values to alleviate syntax.
          query.gsub!('first', 'first = 1')
          query.gsub!('even', 'even = 1')
          query.gsub!('odd', 'odd = 1')
          query.gsub!('last', 'last = 1')
          query.gsub!('solid', 'solid = 1')

          node[:computed_data][:output][:groups] = []

          node[:computed_data][:input][:groups].each_with_index do |group, group_index|

            nth = group_index + 1
            width = Utils.ul2num(group.bounds.width)
            height = Utils.ul2num(group.bounds.height)
            depth = Utils.ul2num(group.bounds.depth)

            first = ( nth == 1 ) ? 1 : 0
            even = ( nth.even? ) ? 1 : 0
            odd = ( nth.odd? ) ? 1 : 0
            last = ( nth == node[:computed_data][:input][:groups].size ) ? 1 : 0
            solid = ( SolidOperations.solid?(group) ) ? 1 : 0

            calculator_result = calculator.evaluate(
              query, {
                a: a, b: b, c: c, d: d, e: e, f: f, g: g, h: h, i: i, j: j, k: k, l: l,
                nth: nth, width: width, height: height, depth: depth,
                first: first, even: even, odd: odd, last: last, solid: solid
              }
            )
    
            raise NodeError.new('Invalid query: ' + query, node[:id])\
              if calculator_result.nil?

            node[:computed_data][:output][:groups].push(group)\
              if calculator_result == true

          end
  
        else
          node[:computed_data][:output][:groups] = []
        end

      when 'Make group'

        if ( node[:computed_data][:input].key?(:groups1) &&
          node[:computed_data][:input][:groups1].is_a?(Array) &&
          !node[:computed_data][:input][:groups1].empty? ) ||
          ( node[:computed_data][:input].key?(:groups2) &&
          node[:computed_data][:input][:groups2].is_a?(Array) &&
          !node[:computed_data][:input][:groups2].empty? ) ||
          ( node[:computed_data][:input].key?(:groups3) &&
          node[:computed_data][:input][:groups3].is_a?(Array) &&
          !node[:computed_data][:input][:groups3].empty? ) ||
          ( node[:computed_data][:input].key?(:groups4) &&
          node[:computed_data][:input][:groups4].is_a?(Array) &&
          !node[:computed_data][:input][:groups4].empty? ) ||
          ( node[:computed_data][:input].key?(:groups5) &&
          node[:computed_data][:input][:groups5].is_a?(Array) &&
          !node[:computed_data][:input][:groups5].empty? ) ||
          ( node[:computed_data][:input].key?(:groups6) &&
          node[:computed_data][:input][:groups6].is_a?(Array) &&
          !node[:computed_data][:input][:groups6].empty? ) ||
          ( node[:computed_data][:input].key?(:groups7) &&
          node[:computed_data][:input][:groups7].is_a?(Array) &&
          !node[:computed_data][:input][:groups7].empty? ) ||
          ( node[:computed_data][:input].key?(:groups8) &&
          node[:computed_data][:input][:groups8].is_a?(Array) &&
          !node[:computed_data][:input][:groups8].empty? ) ||
          ( node[:computed_data][:input].key?(:groups9) &&
          node[:computed_data][:input][:groups9].is_a?(Array) &&
          !node[:computed_data][:input][:groups9].empty? ) ||
          ( node[:computed_data][:input].key?(:groups10) &&
          node[:computed_data][:input][:groups10].is_a?(Array) &&
          !node[:computed_data][:input][:groups10].empty? ) ||
          ( node[:computed_data][:input].key?(:groups11) &&
          node[:computed_data][:input][:groups11].is_a?(Array) &&
          !node[:computed_data][:input][:groups11].empty? ) ||
          ( node[:computed_data][:input].key?(:groups12) &&
          node[:computed_data][:input][:groups12].is_a?(Array) &&
          !node[:computed_data][:input][:groups12].empty? )
          
          model = Sketchup.active_model

          if node[:computed_data][:input].key?(:name) &&
            node[:computed_data][:input][:name].is_a?(String)
            name = node[:computed_data][:input][:name]
          else
            name = ''
          end

          if node[:computed_data][:input].key?(:material) &&
            node[:computed_data][:input][:material].is_a?(String) &&
            !node[:computed_data][:input][:material].empty?
  
            material = model.materials[node[:computed_data][:input][:material]]
  
            if material.nil?
  
              material = model.materials.add(node[:computed_data][:input][:material])
              material.color = Utils.rand_color
  
            end
  
          else
            material = nil
          end
  
          if node[:computed_data][:input].key?(:layer) &&
            node[:computed_data][:input][:layer].is_a?(String) &&
            !node[:computed_data][:input][:layer].empty?
  
            layer = model.layers[node[:computed_data][:input][:layer]]
  
            if layer.nil?
              layer = model.layers.add(node[:computed_data][:input][:layer])
            end
  
          else
            layer = nil
          end

          groups = []

          if node[:computed_data][:input].key?(:groups1) &&
            node[:computed_data][:input][:groups1].is_a?(Array) &&
            !node[:computed_data][:input][:groups1].empty?
            groups = groups.concat(node[:computed_data][:input][:groups1])
          end

          if node[:computed_data][:input].key?(:groups2) &&
            node[:computed_data][:input][:groups2].is_a?(Array) &&
            !node[:computed_data][:input][:groups2].empty?
            groups = groups.concat(node[:computed_data][:input][:groups2])
          end

          if node[:computed_data][:input].key?(:groups3) &&
            node[:computed_data][:input][:groups3].is_a?(Array) &&
            !node[:computed_data][:input][:groups3].empty?
            groups = groups.concat(node[:computed_data][:input][:groups3])
          end

          if node[:computed_data][:input].key?(:groups4) &&
            node[:computed_data][:input][:groups4].is_a?(Array) &&
            !node[:computed_data][:input][:groups4].empty?
            groups = groups.concat(node[:computed_data][:input][:groups4])
          end

          if node[:computed_data][:input].key?(:groups5) &&
            node[:computed_data][:input][:groups5].is_a?(Array) &&
            !node[:computed_data][:input][:groups5].empty?
            groups = groups.concat(node[:computed_data][:input][:groups5])
          end

          if node[:computed_data][:input].key?(:groups6) &&
            node[:computed_data][:input][:groups6].is_a?(Array) &&
            !node[:computed_data][:input][:groups6].empty?
            groups = groups.concat(node[:computed_data][:input][:groups6])
          end

          if node[:computed_data][:input].key?(:groups7) &&
            node[:computed_data][:input][:groups7].is_a?(Array) &&
            !node[:computed_data][:input][:groups7].empty?
            groups = groups.concat(node[:computed_data][:input][:groups7])
          end

          if node[:computed_data][:input].key?(:groups8) &&
            node[:computed_data][:input][:groups8].is_a?(Array) &&
            !node[:computed_data][:input][:groups8].empty?
            groups = groups.concat(node[:computed_data][:input][:groups8])
          end

          if node[:computed_data][:input].key?(:groups9) &&
            node[:computed_data][:input][:groups9].is_a?(Array) &&
            !node[:computed_data][:input][:groups9].empty?
            groups = groups.concat(node[:computed_data][:input][:groups9])
          end

          if node[:computed_data][:input].key?(:groups10) &&
            node[:computed_data][:input][:groups10].is_a?(Array) &&
            !node[:computed_data][:input][:groups10].empty?
            groups = groups.concat(node[:computed_data][:input][:groups10])
          end

          if node[:computed_data][:input].key?(:groups11) &&
            node[:computed_data][:input][:groups11].is_a?(Array) &&
            !node[:computed_data][:input][:groups11].empty?
            groups = groups.concat(node[:computed_data][:input][:groups11])
          end

          if node[:computed_data][:input].key?(:groups12) &&
            node[:computed_data][:input][:groups12].is_a?(Array) &&
            !node[:computed_data][:input][:groups12].empty?
            groups = groups.concat(node[:computed_data][:input][:groups12])
          end

          node[:computed_data][:output][:groups] = [
            Group.make(groups, name, material, layer)
          ]
          
        else
          node[:computed_data][:output][:groups] = []
        end

      else
        raise NodeError.new('Unsupported node type: ' + node[:name], node[:id])
      end

      node[:computed?] = true

      node[:computed_data]
      
    end

  end

end

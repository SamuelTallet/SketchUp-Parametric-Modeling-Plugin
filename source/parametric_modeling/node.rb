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
require 'parametric_modeling/number'
require 'parametric_modeling/shapes'
require 'parametric_modeling/materials'
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
          Number.valid?(node[:computed_data][:input][:width])
          width = Number.to_ul(Number.parse(node[:computed_data][:input][:width]))
        else
          width = Number.to_ul(1)
        end

        if node[:computed_data][:input].key?(:depth) &&
          Number.valid?(node[:computed_data][:input][:depth])
          depth = Number.to_ul(Number.parse(node[:computed_data][:input][:depth]))
        else
          depth = Number.to_ul(1)
        end

        if node[:computed_data][:input].key?(:height) &&
          Number.valid?(node[:computed_data][:input][:height])
          height = Number.to_ul(Number.parse(node[:computed_data][:input][:height]))
        else
          height = Number.to_ul(1)
        end

        if node[:computed_data][:input].key?(:name) &&
          node[:computed_data][:input][:name].is_a?(String)
          name = node[:computed_data][:input][:name]
        else
          name = TRANSLATE['Box']
        end

        if node[:computed_data][:input].key?(:material) &&
          node[:computed_data][:input][:material].is_a?(String) &&
          !node[:computed_data][:input][:material].empty?

          material = model.materials[node[:computed_data][:input][:material]]

          if material.nil?

            material = model.materials.add(node[:computed_data][:input][:material])
            material.color = Materials.rand_color

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
          Number.valid?(node[:computed_data][:input][:radius])
          radius = Number.to_ul(Number.parse(node[:computed_data][:input][:radius]))
        else
          radius = Number.to_ul(1)
        end

        if node[:computed_data][:input].key?(:height) &&
          Number.valid?(node[:computed_data][:input][:height])
          height = Number.to_ul(Number.parse(node[:computed_data][:input][:height]))
        else
          height = Number.to_ul(1)
        end

        if node[:computed_data][:input].key?(:sides) &&
          Number.valid?(node[:computed_data][:input][:sides])

          sides = Number.parse(node[:computed_data][:input][:sides])

          raise NodeError.new('Sides must be an integer.', node[:id])\
            unless sides.is_a?(Integer)

        else
          sides = 6
        end

        if node[:computed_data][:input].key?(:name) &&
          node[:computed_data][:input][:name].is_a?(String)
          name = node[:computed_data][:input][:name]
        else
          name = TRANSLATE['Prism']
        end

        if node[:computed_data][:input].key?(:material) &&
          node[:computed_data][:input][:material].is_a?(String) &&
          !node[:computed_data][:input][:material].empty?

          material = model.materials[node[:computed_data][:input][:material]]

          if material.nil?

            material = model.materials.add(node[:computed_data][:input][:material])
            material.color = Materials.rand_color

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
          Shapes.draw_prism(radius, height, sides, name, material, layer, soft = false)
        ]

      when 'Draw cylinder'

        model = Sketchup.active_model

        if node[:computed_data][:input].key?(:radius) &&
          Number.valid?(node[:computed_data][:input][:radius])
          radius = Number.to_ul(Number.parse(node[:computed_data][:input][:radius]))
        else
          radius = Number.to_ul(1)
        end

        if node[:computed_data][:input].key?(:height) &&
          Number.valid?(node[:computed_data][:input][:height])
          height = Number.to_ul(Number.parse(node[:computed_data][:input][:height]))
        else
          height = Number.to_ul(1)
        end

        if node[:computed_data][:input].key?(:segments) &&
          Number.valid?(node[:computed_data][:input][:segments])

          segments = Number.parse(node[:computed_data][:input][:segments])

          raise NodeError.new('Segments must be an integer.', node[:id])\
            unless segments.is_a?(Integer)

        else
          segments = 16
        end

        if node[:computed_data][:input].key?(:name) &&
          node[:computed_data][:input][:name].is_a?(String)
          name = node[:computed_data][:input][:name]
        else
          name = TRANSLATE['Cylinder']
        end

        if node[:computed_data][:input].key?(:material) &&
          node[:computed_data][:input][:material].is_a?(String) &&
          !node[:computed_data][:input][:material].empty?

          material = model.materials[node[:computed_data][:input][:material]]

          if material.nil?

            material = model.materials.add(node[:computed_data][:input][:material])
            material.color = Materials.rand_color

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
          Shapes.draw_prism(radius, height, segments, name, material, layer, soft = true)
        ]

      when 'Draw tube'

        model = Sketchup.active_model

        if node[:computed_data][:input].key?(:radius) &&
          Number.valid?(node[:computed_data][:input][:radius])

          radius = Number.parse(node[:computed_data][:input][:radius])

          raise NodeError.new('Radius must be a strictly positive number.', node[:id])\
            if radius <= 0

          radius = Number.to_ul(radius)

        else
          radius = Number.to_ul(1)
        end

        if node[:computed_data][:input].key?(:thickness) &&
          Number.valid?(node[:computed_data][:input][:thickness])

          thickness = Number.parse(node[:computed_data][:input][:thickness])

          raise NodeError.new('Thickness must be a strictly positive number.', node[:id])\
            if thickness <= 0

          thickness = Number.to_ul(thickness)

        else
          thickness = Number.to_ul(0.1)
        end

        if node[:computed_data][:input].key?(:height) &&
          Number.valid?(node[:computed_data][:input][:height])
          height = Number.to_ul(Number.parse(node[:computed_data][:input][:height]))
        else
          height = Number.to_ul(1)
        end

        if node[:computed_data][:input].key?(:segments) &&
          Number.valid?(node[:computed_data][:input][:segments])

          segments = Number.parse(node[:computed_data][:input][:segments])

          raise NodeError.new('Segments must be an integer.', node[:id])\
            unless segments.is_a?(Integer)

        else
          segments = 16
        end

        if node[:computed_data][:input].key?(:name) &&
          node[:computed_data][:input][:name].is_a?(String)
          name = node[:computed_data][:input][:name]
        else
          name = TRANSLATE['Tube']
        end

        if node[:computed_data][:input].key?(:material) &&
          node[:computed_data][:input][:material].is_a?(String) &&
          !node[:computed_data][:input][:material].empty?

          material = model.materials[node[:computed_data][:input][:material]]

          if material.nil?

            material = model.materials.add(node[:computed_data][:input][:material])
            material.color = Materials.rand_color

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
          Shapes.draw_tube(radius, thickness, height, segments, name, material, layer)
        ]

      when 'Draw pyramid'

        model = Sketchup.active_model

        if node[:computed_data][:input].key?(:radius) &&
          Number.valid?(node[:computed_data][:input][:radius])
          radius = Number.to_ul(Number.parse(node[:computed_data][:input][:radius]))
        else
          radius = Number.to_ul(1)
        end

        if node[:computed_data][:input].key?(:height) &&
          Number.valid?(node[:computed_data][:input][:height])
          height = Number.to_ul(Number.parse(node[:computed_data][:input][:height]))
        else
          height = Number.to_ul(1)
        end

        if node[:computed_data][:input].key?(:sides) &&
          Number.valid?(node[:computed_data][:input][:sides])

          sides = Number.parse(node[:computed_data][:input][:sides])

          raise NodeError.new('Sides must be an integer.', node[:id])\
            unless sides.is_a?(Integer)

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
            material.color = Materials.rand_color

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
          Shapes.draw_pyramid(radius, height, sides, name, material, layer, soft = false)
        ]

      when 'Draw cone'

        model = Sketchup.active_model

        if node[:computed_data][:input].key?(:radius) &&
          Number.valid?(node[:computed_data][:input][:radius])
          radius = Number.to_ul(Number.parse(node[:computed_data][:input][:radius]))
        else
          radius = Number.to_ul(1)
        end

        if node[:computed_data][:input].key?(:height) &&
          Number.valid?(node[:computed_data][:input][:height])
          height = Number.to_ul(Number.parse(node[:computed_data][:input][:height]))
        else
          height = Number.to_ul(1)
        end

        if node[:computed_data][:input].key?(:segments) &&
          Number.valid?(node[:computed_data][:input][:segments])

          segments = Number.parse(node[:computed_data][:input][:segments])

          raise NodeError.new('Segments must be an integer.', node[:id])\
            unless segments.is_a?(Integer)

        else
          segments = 16
        end

        if node[:computed_data][:input].key?(:name) &&
          node[:computed_data][:input][:name].is_a?(String)
          name = node[:computed_data][:input][:name]
        else
          name = TRANSLATE['Cone']
        end

        if node[:computed_data][:input].key?(:material) &&
          node[:computed_data][:input][:material].is_a?(String) &&
          !node[:computed_data][:input][:material].empty?

          material = model.materials[node[:computed_data][:input][:material]]

          if material.nil?

            material = model.materials.add(node[:computed_data][:input][:material])
            material.color = Materials.rand_color

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
          Shapes.draw_pyramid(radius, height, segments, name, material, layer, soft = true)
        ]

      when 'Draw sphere'

        model = Sketchup.active_model

        if node[:computed_data][:input].key?(:radius) &&
          Number.valid?(node[:computed_data][:input][:radius])
          radius = Number.to_ul(Number.parse(node[:computed_data][:input][:radius]))
        else
          radius = Number.to_ul(1)
        end

        if node[:computed_data][:input].key?(:segments) &&
          Number.valid?(node[:computed_data][:input][:segments])

          segments = Number.parse(node[:computed_data][:input][:segments])

          raise NodeError.new('Segments must be an integer.', node[:id])\
            unless segments.is_a?(Integer)

        else
          segments = 16
        end

        if node[:computed_data][:input].key?(:name) &&
          node[:computed_data][:input][:name].is_a?(String)
          name = node[:computed_data][:input][:name]
        else
          name = TRANSLATE['Sphere']
        end

        if node[:computed_data][:input].key?(:material) &&
          node[:computed_data][:input][:material].is_a?(String) &&
          !node[:computed_data][:input][:material].empty?

          material = model.materials[node[:computed_data][:input][:material]]

          if material.nil?

            material = model.materials.add(node[:computed_data][:input][:material])
            material.color = Materials.rand_color

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
          Shapes.draw_sphere(radius, segments, name, material, layer)
        ]

      when 'Draw shape'

        model = Sketchup.active_model

        if node[:computed_data][:input].key?(:points) &&
          node[:computed_data][:input][:points].is_a?(Array)
          points = node[:computed_data][:input][:points]
        else
          raise NodeError.new('Points not found.', node[:id])
        end

        if node[:computed_data][:input].key?(:name) &&
          node[:computed_data][:input][:name].is_a?(String)
          name = node[:computed_data][:input][:name]
        else
          name = TRANSLATE['Shape']
        end
        
        if node[:computed_data][:input].key?(:material) &&
          node[:computed_data][:input][:material].is_a?(String) &&
          !node[:computed_data][:input][:material].empty?

          material = model.materials[node[:computed_data][:input][:material]]

          if material.nil?

            material = model.materials.add(node[:computed_data][:input][:material])
            material.color = Materials.rand_color

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
          Shapes.draw_shape(points, name, material, layer)
        ]
    
      when 'Number'

        if node[:computed_data][:input].key?(:number) &&
          Number.valid?(node[:computed_data][:input][:number])
          number = Number.parse(node[:computed_data][:input][:number])
        else
          number = 0
        end

        node[:computed_data][:output][:number] = number

      when 'Add'

        if node[:computed_data][:input].key?(:number1) &&
          Number.valid?(node[:computed_data][:input][:number1])
          number1 = Number.parse(node[:computed_data][:input][:number1])
        else
          number1 = 0
        end

        if node[:computed_data][:input].key?(:number2) &&
          Number.valid?(node[:computed_data][:input][:number2])
          number2 = Number.parse(node[:computed_data][:input][:number2])
        else
          number2 = 0
        end

        sum = number1 + number2

        # Fix precision to prevent incorrect result.
        sum = sum.round(6)

        node[:computed_data][:output][:number] = sum

      when 'Subtract'

        if node[:computed_data][:input].key?(:number1) &&
          Number.valid?(node[:computed_data][:input][:number1])
          number1 = Number.parse(node[:computed_data][:input][:number1])
        else
          number1 = 0
        end

        if node[:computed_data][:input].key?(:number2) &&
          Number.valid?(node[:computed_data][:input][:number2])
          number2 = Number.parse(node[:computed_data][:input][:number2])
        else
          number2 = 0
        end

        diff = number1 - number2

        # Fix precision to prevent incorrect result.
        diff = diff.round(6)

        node[:computed_data][:output][:number] = diff

      when 'Multiply'

        if node[:computed_data][:input].key?(:number1) &&
          Number.valid?(node[:computed_data][:input][:number1])
          number1 = Number.parse(node[:computed_data][:input][:number1])
        else
          number1 = 0
        end

        if node[:computed_data][:input].key?(:number2) &&
          Number.valid?(node[:computed_data][:input][:number2])
          number2 = Number.parse(node[:computed_data][:input][:number2])
        else
          number2 = 0
        end

        node[:computed_data][:output][:number] = number1 * number2

      when 'Divide'

        if node[:computed_data][:input].key?(:dividend) &&
          Number.valid?(node[:computed_data][:input][:dividend])
          dividend = node[:computed_data][:input][:dividend].to_f
        else
          dividend = 0.0
        end

        if node[:computed_data][:input].key?(:divisor) &&
          Number.valid?(node[:computed_data][:input][:divisor])
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
            Number.valid?(node[:computed_data][:input][:a])
            a = Number.parse(node[:computed_data][:input][:a])
          else
            a = 0
          end
  
          if node[:computed_data][:input].key?(:b) &&
            Number.valid?(node[:computed_data][:input][:b])
            b = Number.parse(node[:computed_data][:input][:b])
          else
            b = 0
          end
  
          if node[:computed_data][:input].key?(:c) &&
            Number.valid?(node[:computed_data][:input][:c])
            c = Number.parse(node[:computed_data][:input][:c])
          else
            c = 0
          end
  
          if node[:computed_data][:input].key?(:d) &&
            Number.valid?(node[:computed_data][:input][:d])
            d = Number.parse(node[:computed_data][:input][:d])
          else
            d = 0
          end
  
          if node[:computed_data][:input].key?(:e) &&
            Number.valid?(node[:computed_data][:input][:e])
            e = Number.parse(node[:computed_data][:input][:e])
          else
            e = 0
          end
  
          if node[:computed_data][:input].key?(:f) &&
            Number.valid?(node[:computed_data][:input][:f])
            f = Number.parse(node[:computed_data][:input][:f])
          else
            f = 0
          end

          if node[:computed_data][:input].key?(:g) &&
            Number.valid?(node[:computed_data][:input][:g])
            g = Number.parse(node[:computed_data][:input][:g])
          else
            g = 0
          end

          if node[:computed_data][:input].key?(:h) &&
            Number.valid?(node[:computed_data][:input][:h])
            h = Number.parse(node[:computed_data][:input][:h])
          else
            h = 0
          end

          if node[:computed_data][:input].key?(:i) &&
            Number.valid?(node[:computed_data][:input][:i])
            i = Number.parse(node[:computed_data][:input][:i])
          else
            i = 0
          end

          if node[:computed_data][:input].key?(:j) &&
            Number.valid?(node[:computed_data][:input][:j])
            j = Number.parse(node[:computed_data][:input][:j])
          else
            j = 0
          end

          if node[:computed_data][:input].key?(:k) &&
            Number.valid?(node[:computed_data][:input][:k])
            k = Number.parse(node[:computed_data][:input][:k])
          else
            k = 0
          end

          if node[:computed_data][:input].key?(:l) &&
            Number.valid?(node[:computed_data][:input][:l])
            l = Number.parse(node[:computed_data][:input][:l])
          else
            l = 0
          end

          calculator = Dentaku::Calculator.new({
            aliases: {
              roundup: ['ceil'],
              rounddown: ['floor']
            }
          })

          # Generates a random number.
          calculator.add_function(
            :rand, :numeric, ->(number1, number2) { rand(number1..number2) }
          )

          # Converts degrees to radians.
          calculator.add_function(
            :deg, :numeric, ->(angle) { angle * ( Math::PI / 180 ) }
          )

          calculator_result = calculator.evaluate(
            formula, {
              a: a, b: b, c: c, d: d, e: e, f: f, g: g, h: h, i: i, j: j, k: k, l: l,
              pi: Math::PI
            }
          )
  
          raise NodeError.new('Incorrect formula: ' + formula, node[:id])\
            if calculator_result.nil?
  
          node[:computed_data][:output][:number] = Number.parse(calculator_result)
  
        else
          node[:computed_data][:output][:number] = 0
        end

      when 'Point'

        if node[:computed_data][:input].key?(:x) &&
          Number.valid?(node[:computed_data][:input][:x])
          x = Number.to_ul(Number.parse(node[:computed_data][:input][:x]))
        else
          x = 0
        end

        if node[:computed_data][:input].key?(:y) &&
          Number.valid?(node[:computed_data][:input][:y])
          y = Number.to_ul(Number.parse(node[:computed_data][:input][:y]))
        else
          y = 0
        end

        if node[:computed_data][:input].key?(:z) &&
          Number.valid?(node[:computed_data][:input][:z])
          z = Number.to_ul(Number.parse(node[:computed_data][:input][:z]))
        else
          z = 0
        end

        node[:computed_data][:output][:point] = Geom::Point3d.new(x, y, z)

      when 'Get points'

        node[:computed_data][:output][:center] = ORIGIN

        # TODO

      when 'Vector'

        if node[:computed_data][:input].key?(:x) &&
          Number.valid?(node[:computed_data][:input][:x])
          x = Number.parse(node[:computed_data][:input][:x])
        else
          x = 0
        end

        if node[:computed_data][:input].key?(:y) &&
          Number.valid?(node[:computed_data][:input][:y])
          y = Number.parse(node[:computed_data][:input][:y])
        else
          y = 0
        end

        if node[:computed_data][:input].key?(:z) &&
          Number.valid?(node[:computed_data][:input][:z])
          z = Number.parse(node[:computed_data][:input][:z])
        else
          z = 0
        end

        node[:computed_data][:output][:vector] = Geom::Vector3d.new(x, y, z)

      when 'Intersect solids'

        node[:computed_data][:output][:groups] = []

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

          raise NodeError.new('Boolean intersect failed.', node[:id])\
            unless status == true
          
          node[:computed_data][:output][:groups] = [
            node[:computed_data][:input][:groups1].first
          ]
          
        end

      when 'Unite solids'

        node[:computed_data][:output][:groups] = []

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

          raise NodeError.new('Boolean union failed.', node[:id])\
            unless status == true
          
          node[:computed_data][:output][:groups] = [
            node[:computed_data][:input][:groups1].first
          ]
          
        end

      when 'Subtract solids'

        node[:computed_data][:output][:groups] = []

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

          raise NodeError.new('Boolean subtract failed.', node[:id])\
            unless status == true
          
          node[:computed_data][:output][:groups] = [
            node[:computed_data][:input][:groups1].first
          ]
          
        end

      when 'Push/Pull'

        node[:computed_data][:output][:groups] = []

        if node[:computed_data][:input].key?(:groups) &&
          node[:computed_data][:input][:groups].is_a?(Array) &&
          !node[:computed_data][:input][:groups].empty?

          if node[:computed_data][:input].key?(:distance) &&
            Number.valid?(node[:computed_data][:input][:distance])
            distance = Number.to_ul(Number.parse(node[:computed_data][:input][:distance]))
          else
            distance = Number.to_ul(1)
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

        end

      when 'Move'

        node[:computed_data][:output][:groups] = []

        if node[:computed_data][:input].key?(:groups) &&
          node[:computed_data][:input][:groups].is_a?(Array) &&
          !node[:computed_data][:input][:groups].empty?

          if node[:computed_data][:input].key?(:point) &&
            node[:computed_data][:input][:point].is_a?(Geom::Point3d)
            point = node[:computed_data][:input][:point]
          else
            point = Geom::Point3d.new(Number.to_ul(1), 0, 0)
          end
  
          initial_point_x = point.x
          initial_point_y = point.y
          initial_point_z = point.z

          if node[:computed_data][:input].key?(:point_is_absolute) &&
            node[:computed_data][:input][:point_is_absolute] == true
            point_is_absolute = true
          else
            point_is_absolute = false
          end

          node[:computed_data][:input][:groups].each do |group|

            node[:computed_data][:output][:groups].push(
              Group.move(group, point, point_is_absolute)
            )

            point = Geom::Point3d.new(
              point.x + initial_point_x,
              point.y + initial_point_y,
              point.z + initial_point_z
            )

          end

        end

      when 'Rotate'

        node[:computed_data][:output][:groups] = []

        if node[:computed_data][:input].key?(:groups) &&
          node[:computed_data][:input][:groups].is_a?(Array) &&
          !node[:computed_data][:input][:groups].empty?

          if node[:computed_data][:input].key?(:axis) &&
            node[:computed_data][:input][:axis].is_a?(Geom::Vector3d)
            axis = node[:computed_data][:input][:axis]
          else
            axis = Z_AXIS
          end

          if node[:computed_data][:input].key?(:angle) &&
            Number.valid?(node[:computed_data][:input][:angle])
            angle = Number.parse(node[:computed_data][:input][:angle])
          else
            angle = 45
          end
  
          initial_angle = angle

          node[:computed_data][:input][:groups].each do |group|

            if node[:computed_data][:input].key?(:center) &&
              node[:computed_data][:input][:center].is_a?(Geom::Point3d)
              center = node[:computed_data][:input][:center]
            else
              center = group.bounds.center
            end

            node[:computed_data][:output][:groups].push(
              Group.rotate(group, center, axis, angle)
            )

            angle = angle + initial_angle

          end

        end

      when 'Scale'

        node[:computed_data][:output][:groups] = []

        if node[:computed_data][:input].key?(:groups) &&
          node[:computed_data][:input][:groups].is_a?(Array) &&
          !node[:computed_data][:input][:groups].empty?

          if node[:computed_data][:input].key?(:x_factor) &&
            Number.valid?(node[:computed_data][:input][:x_factor])
            x_factor = Number.parse(node[:computed_data][:input][:x_factor])
          else
            x_factor = 2
          end

          if node[:computed_data][:input].key?(:y_factor) &&
            Number.valid?(node[:computed_data][:input][:y_factor])
            y_factor = Number.parse(node[:computed_data][:input][:y_factor])
          else
            y_factor = 2
          end

          if node[:computed_data][:input].key?(:z_factor) &&
            Number.valid?(node[:computed_data][:input][:z_factor])
            z_factor = Number.parse(node[:computed_data][:input][:z_factor])
          else
            z_factor = 2
          end
  
          initial_x_factor = x_factor
          initial_y_factor = y_factor
          initial_z_factor = z_factor

          node[:computed_data][:input][:groups].each do |group|

            if node[:computed_data][:input].key?(:point) &&
              node[:computed_data][:input][:point].is_a?(Geom::Point3d)
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

        end

      when 'Paint'

        node[:computed_data][:output][:groups] = []

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
              material.color = Materials.rand_color
  
            end
  
          else
            material = nil
          end

          node[:computed_data][:input][:groups].each do |group|

            group.material = material
            node[:computed_data][:output][:groups].push(group)

          end

        end

      when 'Tag'

        node[:computed_data][:output][:groups] = []

        if node[:computed_data][:input].key?(:groups) &&
          node[:computed_data][:input][:groups].is_a?(Array) &&
          !node[:computed_data][:input][:groups].empty?

          model = Sketchup.active_model

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

          node[:computed_data][:input][:groups].each do |group|

            group.layer = layer
            node[:computed_data][:output][:groups].push(group)

          end

        end

      when 'Erase'

        if node[:computed_data][:input].key?(:groups) &&
          node[:computed_data][:input][:groups].is_a?(Array) &&
          !node[:computed_data][:input][:groups].empty?
          node[:computed_data][:input][:groups].each { |group| group.erase! }
        end

      when 'Copy'

        node[:computed_data][:output][:groups] = []
        node[:computed_data][:output][:original_groups] = []

        if node[:computed_data][:input].key?(:groups) &&
          node[:computed_data][:input][:groups].is_a?(Array) &&
          !node[:computed_data][:input][:groups].empty?

          if node[:computed_data][:input].key?(:output_original) &&
            node[:computed_data][:input][:output_original] == true
            put_originals_with_copies = true
          else
            put_originals_with_copies = false
          end

          if node[:computed_data][:input].key?(:copies) &&
            Number.valid?(node[:computed_data][:input][:copies])

            copies = Number.parse(node[:computed_data][:input][:copies])

            raise NodeError.new('Copies must be an integer.', node[:id])\
              unless copies.is_a?(Integer)

          else
            copies = 1
          end
          
          node[:computed_data][:input][:groups].each do |group|

            if put_originals_with_copies
              node[:computed_data][:output][:groups].push(group)
            else
              node[:computed_data][:output][:original_groups].push(group)
            end

            copies.times do
              node[:computed_data][:output][:groups].push(Group.copy(group))
            end

          end

        end

      when 'Concatenate'

        node[:computed_data][:output][:groups] = []

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

          node[:computed_data][:output][:groups] = groups
          
        end

      when 'Select'

        node[:computed_data][:output][:groups] = []
        node[:computed_data][:output][:not_groups] = []

        if node[:computed_data][:input].key?(:groups) &&
          node[:computed_data][:input][:groups].is_a?(Array) &&
          !node[:computed_data][:input][:groups].empty? &&
          node[:computed_data][:input].key?(:query) &&
          node[:computed_data][:input][:query].is_a?(String)

          query = node[:computed_data][:input][:query]

          if node[:computed_data][:input].key?(:a) &&
            Number.valid?(node[:computed_data][:input][:a])
            a = Number.parse(node[:computed_data][:input][:a])
          else
            a = 0
          end
  
          if node[:computed_data][:input].key?(:b) &&
            Number.valid?(node[:computed_data][:input][:b])
            b = Number.parse(node[:computed_data][:input][:b])
          else
            b = 0
          end
  
          if node[:computed_data][:input].key?(:c) &&
            Number.valid?(node[:computed_data][:input][:c])
            c = Number.parse(node[:computed_data][:input][:c])
          else
            c = 0
          end
  
          if node[:computed_data][:input].key?(:d) &&
            Number.valid?(node[:computed_data][:input][:d])
            d = Number.parse(node[:computed_data][:input][:d])
          else
            d = 0
          end
  
          if node[:computed_data][:input].key?(:e) &&
            Number.valid?(node[:computed_data][:input][:e])
            e = Number.parse(node[:computed_data][:input][:e])
          else
            e = 0
          end
  
          if node[:computed_data][:input].key?(:f) &&
            Number.valid?(node[:computed_data][:input][:f])
            f = Number.parse(node[:computed_data][:input][:f])
          else
            f = 0
          end

          if node[:computed_data][:input].key?(:g) &&
            Number.valid?(node[:computed_data][:input][:g])
            g = Number.parse(node[:computed_data][:input][:g])
          else
            g = 0
          end

          if node[:computed_data][:input].key?(:h) &&
            Number.valid?(node[:computed_data][:input][:h])
            h = Number.parse(node[:computed_data][:input][:h])
          else
            h = 0
          end

          if node[:computed_data][:input].key?(:i) &&
            Number.valid?(node[:computed_data][:input][:i])
            i = Number.parse(node[:computed_data][:input][:i])
          else
            i = 0
          end

          if node[:computed_data][:input].key?(:j) &&
            Number.valid?(node[:computed_data][:input][:j])
            j = Number.parse(node[:computed_data][:input][:j])
          else
            j = 0
          end

          if node[:computed_data][:input].key?(:k) &&
            Number.valid?(node[:computed_data][:input][:k])
            k = Number.parse(node[:computed_data][:input][:k])
          else
            k = 0
          end

          if node[:computed_data][:input].key?(:l) &&
            Number.valid?(node[:computed_data][:input][:l])
            l = Number.parse(node[:computed_data][:input][:l])
          else
            l = 0
          end

          calculator = Dentaku::Calculator.new({
            aliases: {
              roundup: ['ceil'],
              rounddown: ['floor']
            }
          })

          # Generates a random number.
          calculator.add_function(
            :rand, :numeric, ->(number1, number2) { rand(number1..number2) }
          )

          # Converts degrees to radians.
          calculator.add_function(
            :deg, :numeric, ->(angle) { angle * ( Math::PI / 180 ) }
          )

          # Select queries use implicit boolean values to alleviate syntax.
          query.downcase!
          query.gsub!('first', 'first = 1')
          query.gsub!('even', 'even = 1')
          query.gsub!('odd', 'odd = 1')
          query.gsub!('last', 'last = 1')
          query.gsub!('solid', 'solid = 1')
          query.gsub!('random', 'random = 1')

          count = node[:computed_data][:input][:groups].size
          rand_nth = rand(1..count)

          node[:computed_data][:input][:groups].each_with_index do |group, group_index|

            nth = group_index + 1
            width = Number.from_ul(group.bounds.width)
            height = Number.from_ul(group.bounds.height)
            depth = Number.from_ul(group.bounds.depth)

            first = ( nth == 1 ) ? 1 : 0
            even = ( nth.even? ) ? 1 : 0
            odd = ( nth.odd? ) ? 1 : 0
            last = ( nth == count ) ? 1 : 0
            solid = ( query.include?('solid') && SolidOperations.solid?(group) ) ? 1 : 0
            random = ( nth == rand_nth ) ? 1 : 0

            name = group.name.downcase

            if group.material.is_a?(Sketchup::Material)
              material = group.material.display_name.downcase
            else
              material = ''
            end

            if group.layer.is_a?(Sketchup::Layer)

              layer = group.layer.name.downcase

              if layer == 'layer0'
                layer = ''
              end

            else
              layer = ''
            end

            calculator_result = calculator.evaluate(
              query, {
                a: a, b: b, c: c, d: d, e: e, f: f, g: g, h: h, i: i, j: j, k: k, l: l,
                nth: nth, width: width, height: height, depth: depth,
                first: first, even: even, odd: odd, last: last, solid: solid, random: random,
                name: name, material: material, tag: layer, layer: layer
              }
            )
    
            raise NodeError.new('Invalid query: ' + query, node[:id])\
              if calculator_result.nil?

            if calculator_result == true
              node[:computed_data][:output][:groups].push(group)
            else
              node[:computed_data][:output][:not_groups].push(group)
            end

          end
  
        end

      when 'Make group'

        node[:computed_data][:output][:groups] = []

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
              material.color = Materials.rand_color
  
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
          
        end

      else
        raise NodeError.new('Unsupported node type: ' + node[:name], node[:id])
      end

      node[:computed?] = true

      node[:computed_data]
      
    end

  end

end

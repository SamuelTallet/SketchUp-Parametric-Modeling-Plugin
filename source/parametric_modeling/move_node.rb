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
require 'parametric_modeling/number'
require 'parametric_modeling/group'

# Parametric Modeling plugin namespace.
module ParametricModeling

  module MoveNode

    # Computes a node of type "Move".
    #
    # @param [Hash] node
    # @raise [ArgumentError]
    #
    # @return [Hash] Node
    def self.compute(node)

      raise ArgumentError, 'Node must be a Hash.'\
        unless node.is_a?(Hash)

      node[:computed_data][:output][:groups] = []

      if node[:computed_data][:input].key?(:groups) &&
        node[:computed_data][:input][:groups].is_a?(Array) &&
        !node[:computed_data][:input][:groups].empty?

        if node[:computed_data][:input].key?(:point) &&
          node[:computed_data][:input][:point].is_a?(Geom::Point3d)
          position = node[:computed_data][:input][:point]
        else
          position = Geom::Point3d.new(Number.to_ul(1), 0, 0)
        end

        initial_position_x = position.x
        initial_position_y = position.y
        initial_position_z = position.z

        if node[:computed_data][:input].key?(:point_is_absolute) &&
          node[:computed_data][:input][:point_is_absolute] == true
          position_is_absolute = true
        else
          position_is_absolute = false
        end

        if ( node[:computed_data][:input].key?(:x_position) &&
          node[:computed_data][:input][:x_position].is_a?(String) &&
          !node[:computed_data][:input][:x_position].empty? ) ||
          ( node[:computed_data][:input].key?(:y_position) &&
          node[:computed_data][:input][:y_position].is_a?(String) &&
          !node[:computed_data][:input][:y_position].empty? ) ||
          ( node[:computed_data][:input].key?(:z_position) &&
          node[:computed_data][:input][:z_position].is_a?(String) &&
          !node[:computed_data][:input][:z_position].empty? )

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

          if node[:computed_data][:input].key?(:x_position) &&
            node[:computed_data][:input][:x_position].is_a?(String) &&
            !node[:computed_data][:input][:x_position].empty?

            x_position = node[:computed_data][:input][:x_position]

            # Implicit boolean values alleviate the syntax.
            x_position.downcase!
            x_position.gsub!('first', 'first = 1')
            x_position.gsub!('even', 'even = 1')
            x_position.gsub!('odd', 'odd = 1')
            x_position.gsub!('last', 'last = 1')

          else
            x_position = ''
          end

          if node[:computed_data][:input].key?(:y_position) &&
            node[:computed_data][:input][:y_position].is_a?(String) &&
            !node[:computed_data][:input][:y_position].empty?

            y_position = node[:computed_data][:input][:y_position]

            # Implicit boolean values alleviate the syntax.
            y_position.downcase!
            y_position.gsub!('first', 'first = 1')
            y_position.gsub!('even', 'even = 1')
            y_position.gsub!('odd', 'odd = 1')
            y_position.gsub!('last', 'last = 1')

          else
            y_position = ''
          end

          if node[:computed_data][:input].key?(:z_position) &&
            node[:computed_data][:input][:z_position].is_a?(String) &&
            !node[:computed_data][:input][:z_position].empty?

            z_position = node[:computed_data][:input][:z_position]

            # Implicit boolean values alleviate the syntax.
            z_position.downcase!
            z_position.gsub!('first', 'first = 1')
            z_position.gsub!('even', 'even = 1')
            z_position.gsub!('odd', 'odd = 1')
            z_position.gsub!('last', 'last = 1')

          else
            z_position = ''
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

          count = node[:computed_data][:input][:groups].size
          x = 0
          y = 0
          z = 0

          node[:computed_data][:input][:groups].each_with_index do |group, group_index|

            nth = group_index + 1

            first = ( nth == 1 ) ? 1 : 0
            even = ( nth.even? ) ? 1 : 0
            odd = ( nth.odd? ) ? 1 : 0
            last = ( nth == count ) ? 1 : 0

            if !x_position.empty?

              x = calculator.evaluate(
                x_position, {
                  a: a, b: b, c: c, d: d, e: e, f: f,
                  count: count, nth: nth,
                  x: Number.from_ul(position.x),
                  y: Number.from_ul(position.y),
                  z: Number.from_ul(position.z),
                  first: first, even: even, odd: odd, last: last
                }
              )
      
              raise NodeError.new('Bad X position: ' + x_position, node[:id])\
                if x.nil?
  
              x = Number.parse(x)
  
            end

            if !y_position.empty?

              y = calculator.evaluate(
                y_position, {
                  a: a, b: b, c: c, d: d, e: e, f: f,
                  count: count, nth: nth,
                  x: Number.from_ul(position.x),
                  y: Number.from_ul(position.y),
                  z: Number.from_ul(position.z),
                  first: first, even: even, odd: odd, last: last
                }
              )
      
              raise NodeError.new('Bad Y position: ' + y_position, node[:id])\
                if y.nil?
  
              y = Number.parse(y)
  
            end

            if !z_position.empty?

              z = calculator.evaluate(
                z_position, {
                  a: a, b: b, c: c, d: d, e: e, f: f,
                  count: count, nth: nth,
                  x: Number.from_ul(position.x),
                  y: Number.from_ul(position.y),
                  z: Number.from_ul(position.z),
                  first: first, even: even, odd: odd, last: last
                }
              )
      
              raise NodeError.new('Bad Z position: ' + z_position, node[:id])\
                if z.nil?
  
              z = Number.parse(z)
  
            end

            position = Geom::Point3d.new(
              Number.to_ul(x),
              Number.to_ul(y),
              Number.to_ul(z)
            )

            node[:computed_data][:output][:groups].push(
              Group.move(group, position, position_is_absolute)
            )

          end

        else

          node[:computed_data][:input][:groups].each do |group|

            node[:computed_data][:output][:groups].push(
              Group.move(group, position, position_is_absolute)
            )
  
            position = Geom::Point3d.new(
              position.x + initial_position_x,
              position.y + initial_position_y,
              position.z + initial_position_z
            )
  
          end

        end

      end

      node

    end

  end

end

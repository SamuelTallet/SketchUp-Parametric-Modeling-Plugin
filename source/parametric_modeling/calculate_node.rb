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

require 'dentaku'
require 'parametric_modeling/number'
require 'parametric_modeling/node_error'

# Parametric Modeling plugin namespace.
module ParametricModeling

  module CalculateNode

    # Computes a node of type "Calculate".
    #
    # @param [Hash] node
    # @raise [ArgumentError]
    #
    # @raise [NodeError]
    #
    # @return [Hash] Node
    def self.compute(node)

      raise ArgumentError, 'Node must be a Hash.'\
        unless node.is_a?(Hash)

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

      node

    end

  end

end

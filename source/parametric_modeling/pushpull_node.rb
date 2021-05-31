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
require 'parametric_modeling/number'
require 'parametric_modeling/group'

# Parametric Modeling plugin namespace.
module ParametricModeling

  module PushPullNode

    # Computes a node of type "Push/Pull".
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

        if node[:computed_data][:input].key?(:distance) &&
          Number.valid?(node[:computed_data][:input][:distance])

          # Zero value (0) is allowed to let user define a null distance parametrically.
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

      node

    end

  end

end

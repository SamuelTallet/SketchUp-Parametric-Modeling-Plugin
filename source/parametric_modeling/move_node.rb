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

      node

    end

  end

end

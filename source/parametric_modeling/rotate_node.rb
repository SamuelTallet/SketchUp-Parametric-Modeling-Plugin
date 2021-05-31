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

  module RotateNode

    # Computes a node of type "Rotate".
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
      
      node

    end

  end

end

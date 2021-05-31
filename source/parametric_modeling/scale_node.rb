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

  module ScaleNode

    # Computes a node of type "Scale".
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
      
      node

    end

  end

end

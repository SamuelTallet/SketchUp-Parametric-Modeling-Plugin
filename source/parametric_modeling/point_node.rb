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

# Parametric Modeling plugin namespace.
module ParametricModeling

  module PointNode

    # Computes a node of type "Point".
    #
    # @param [Hash] node
    # @raise [ArgumentError]
    #
    # @return [Hash] Node
    def self.compute(node)

      raise ArgumentError, 'Node must be a Hash.'\
        unless node.is_a?(Hash)

      if node[:computed_data][:input].key?(:parent_point) &&
        node[:computed_data][:input][:parent_point].is_a?(Geom::Point3d)

        x = Number.from_ul(node[:computed_data][:input][:parent_point].x)
        y = Number.from_ul(node[:computed_data][:input][:parent_point].y)
        z = Number.from_ul(node[:computed_data][:input][:parent_point].z)

        if node[:computed_data][:input].key?(:x) &&
          Number.valid?(node[:computed_data][:input][:x])

          if node[:computed_data][:input].key?(:increment_inherited_xyz) &&
            node[:computed_data][:input][:increment_inherited_xyz] == true
            x = x + Number.parse(node[:computed_data][:input][:x])
          else
            # Overwrite parent's X value with child's X value.
            x = Number.parse(node[:computed_data][:input][:x])
          end

        end

        if node[:computed_data][:input].key?(:y) &&
          Number.valid?(node[:computed_data][:input][:y])

          if node[:computed_data][:input].key?(:increment_inherited_xyz) &&
            node[:computed_data][:input][:increment_inherited_xyz] == true
            y = y + Number.parse(node[:computed_data][:input][:y])
          else
            # Overwrite parent's Y value with child's Y value.
            y = Number.parse(node[:computed_data][:input][:y])
          end

        end

        if node[:computed_data][:input].key?(:z) &&
          Number.valid?(node[:computed_data][:input][:z])

          if node[:computed_data][:input].key?(:increment_inherited_xyz) &&
            node[:computed_data][:input][:increment_inherited_xyz] == true
            z = z + Number.parse(node[:computed_data][:input][:z])
          else
            # Overwrite parent's Z value with child's Z value.
            z = Number.parse(node[:computed_data][:input][:z])
          end

        end

      else

        x = y = z = 0

        if node[:computed_data][:input].key?(:x) &&
          Number.valid?(node[:computed_data][:input][:x])
          x = Number.parse(node[:computed_data][:input][:x])
        end

        if node[:computed_data][:input].key?(:y) &&
          Number.valid?(node[:computed_data][:input][:y])
          y = Number.parse(node[:computed_data][:input][:y])
        end

        if node[:computed_data][:input].key?(:z) &&
          Number.valid?(node[:computed_data][:input][:z])
          z = Number.parse(node[:computed_data][:input][:z])
        end

      end

      node[:computed_data][:output][:point] = Geom::Point3d.new(
        Number.to_ul(x), Number.to_ul(y), Number.to_ul(z)
      )

      node

    end

  end

end

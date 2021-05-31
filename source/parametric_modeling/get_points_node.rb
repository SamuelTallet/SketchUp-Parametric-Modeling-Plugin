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

# Parametric Modeling plugin namespace.
module ParametricModeling

  module GetPointsNode

    # Computes a node of type "Get points".
    #
    # @param [Hash] node
    # @raise [ArgumentError]
    #
    # @return [Hash] Node
    def self.compute(node)

      raise ArgumentError, 'Node must be a Hash.'\
        unless node.is_a?(Hash)

      node[:computed_data][:output][:groups] = []

      node[:computed_data][:output][:front_bottom_left] = ORIGIN
      node[:computed_data][:output][:front_bottom_center] = ORIGIN
      node[:computed_data][:output][:front_bottom_right] = ORIGIN
      node[:computed_data][:output][:front_center] = ORIGIN
      node[:computed_data][:output][:front_top_left] = ORIGIN
      node[:computed_data][:output][:front_top_center] = ORIGIN
      node[:computed_data][:output][:front_top_right] = ORIGIN

      node[:computed_data][:output][:bottom_center] = ORIGIN

      node[:computed_data][:output][:left_bottom_center] = ORIGIN
      node[:computed_data][:output][:left_center] = ORIGIN
      node[:computed_data][:output][:left_top_center] = ORIGIN

      node[:computed_data][:output][:center] = ORIGIN

      node[:computed_data][:output][:right_bottom_center] = ORIGIN
      node[:computed_data][:output][:right_center] = ORIGIN
      node[:computed_data][:output][:right_top_center] = ORIGIN
      
      node[:computed_data][:output][:top_center] = ORIGIN

      node[:computed_data][:output][:back_bottom_left] = ORIGIN
      node[:computed_data][:output][:back_bottom_center] = ORIGIN
      node[:computed_data][:output][:back_bottom_right] = ORIGIN
      node[:computed_data][:output][:back_center] = ORIGIN
      node[:computed_data][:output][:back_top_left] = ORIGIN
      node[:computed_data][:output][:back_top_center] = ORIGIN
      node[:computed_data][:output][:back_top_right] = ORIGIN

      if node[:computed_data][:input].key?(:groups) &&
        node[:computed_data][:input][:groups].is_a?(Array) &&
        !node[:computed_data][:input][:groups].empty?

        group = node[:computed_data][:input][:groups].first

        node[:computed_data][:output][:groups] = [group]

        bounding_box = group.bounds

        node[:computed_data][:output][:front_bottom_left] = bounding_box.corner(0)
        node[:computed_data][:output][:front_bottom_center] = Geom::Point3d.linear_combination(
          0.5, bounding_box.corner(0), 0.5, bounding_box.corner(1)
        )
        node[:computed_data][:output][:front_bottom_right] = bounding_box.corner(1)
        node[:computed_data][:output][:front_center] = Geom::Point3d.linear_combination(
          0.5, bounding_box.corner(1), 0.5, bounding_box.corner(4)
        )
        node[:computed_data][:output][:front_top_left] = bounding_box.corner(4)
        node[:computed_data][:output][:front_top_center] = Geom::Point3d.linear_combination(
          0.5, bounding_box.corner(4), 0.5, bounding_box.corner(5)
        )
        node[:computed_data][:output][:front_top_right] = bounding_box.corner(5)

        node[:computed_data][:output][:bottom_center] = Geom::Point3d.linear_combination(
          0.5, bounding_box.corner(0), 0.5, bounding_box.corner(3)
        )

        node[:computed_data][:output][:left_bottom_center] = Geom::Point3d.linear_combination(
          0.5, bounding_box.corner(0), 0.5, bounding_box.corner(2)
        )
        node[:computed_data][:output][:left_center] = Geom::Point3d.linear_combination(
          0.5, bounding_box.corner(2), 0.5, bounding_box.corner(4)
        )
        node[:computed_data][:output][:left_top_center] = Geom::Point3d.linear_combination(
          0.5, bounding_box.corner(4), 0.5, bounding_box.corner(6)
        )

        node[:computed_data][:output][:center] = bounding_box.center

        node[:computed_data][:output][:right_bottom_center] = Geom::Point3d.linear_combination(
          0.5, bounding_box.corner(1), 0.5, bounding_box.corner(3)
        )
        node[:computed_data][:output][:right_center] = Geom::Point3d.linear_combination(
          0.5, bounding_box.corner(3), 0.5, bounding_box.corner(5)
        )
        node[:computed_data][:output][:right_top_center] = Geom::Point3d.linear_combination(
          0.5, bounding_box.corner(5), 0.5, bounding_box.corner(7)
        )

        node[:computed_data][:output][:top_center] = Geom::Point3d.linear_combination(
          0.5, bounding_box.corner(4), 0.5, bounding_box.corner(7)
        )

        node[:computed_data][:output][:back_bottom_left] = bounding_box.corner(2)
        node[:computed_data][:output][:back_bottom_center] = Geom::Point3d.linear_combination(
          0.5, bounding_box.corner(2), 0.5, bounding_box.corner(3)
        )
        node[:computed_data][:output][:back_bottom_right] = bounding_box.corner(3)
        node[:computed_data][:output][:back_center] = Geom::Point3d.linear_combination(
          0.5, bounding_box.corner(3), 0.5, bounding_box.corner(6)
        )
        node[:computed_data][:output][:back_top_left] = bounding_box.corner(6)
        node[:computed_data][:output][:back_top_center] = Geom::Point3d.linear_combination(
          0.5, bounding_box.corner(6), 0.5, bounding_box.corner(7)
        )
        node[:computed_data][:output][:back_top_right] = bounding_box.corner(7)

      end

      node

    end

  end

end

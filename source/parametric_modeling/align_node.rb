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
require 'parametric_modeling/group'

# Parametric Modeling plugin namespace.
module ParametricModeling

  module AlignNode

    # Computes a node of type "Align".
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

        group = node[:computed_data][:input][:groups].first

        if node[:computed_data][:input].key?(:origin) &&
          node[:computed_data][:input][:origin].is_a?(Geom::Point3d)
          origin = node[:computed_data][:input][:origin]
        else
          origin = group.bounds.center
        end

        if node[:computed_data][:input].key?(:target) &&
          node[:computed_data][:input][:target].is_a?(Geom::Point3d)
          target = node[:computed_data][:input][:target]
        else
          target = ORIGIN
        end

        node[:computed_data][:output][:groups].push(Group.align(group, origin, target))

      end

      node

    end

  end

end

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

  module VectorNode

    # Computes a node of type "Vector".
    #
    # @param [Hash] node
    # @raise [ArgumentError]
    #
    # @return [Hash] Node
    def self.compute(node)

      raise ArgumentError, 'Node must be a Hash.'\
        unless node.is_a?(Hash)
      
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

      node

    end

  end

end

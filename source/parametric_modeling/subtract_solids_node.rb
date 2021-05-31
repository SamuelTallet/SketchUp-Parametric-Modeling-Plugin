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

require 'parametric_modeling/solid_operations'
require 'parametric_modeling/node_error'

# Parametric Modeling plugin namespace.
module ParametricModeling

  module SubtractSolidsNode

    # Computes a node of type "Subtract solids".
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

      node[:computed_data][:output][:groups] = []

      if node[:computed_data][:input].key?(:groups1) &&
        node[:computed_data][:input][:groups1].is_a?(Array) &&
        !node[:computed_data][:input][:groups1].empty? &&
        node[:computed_data][:input].key?(:groups2) &&
        node[:computed_data][:input][:groups2].is_a?(Array) &&
        !node[:computed_data][:input][:groups2].empty?

        status = SolidOperations.subtract(
          node[:computed_data][:input][:groups1].first,
          node[:computed_data][:input][:groups2].first
        )

        raise NodeError.new('Boolean subtract failed.', node[:id])\
          unless status == true
        
        node[:computed_data][:output][:groups] = [
          node[:computed_data][:input][:groups1].first
        ]
        
      end

      node

    end

  end

end

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

require 'parametric_modeling/number'
require 'parametric_modeling/group'
require 'parametric_modeling/node_error'

# Parametric Modeling plugin namespace.
module ParametricModeling

  module CopyNode

    # Computes a node of type "Copy".
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
      node[:computed_data][:output][:original_groups] = []

      if node[:computed_data][:input].key?(:groups) &&
        node[:computed_data][:input][:groups].is_a?(Array) &&
        !node[:computed_data][:input][:groups].empty?

        if node[:computed_data][:input].key?(:output_original) &&
          node[:computed_data][:input][:output_original] == true
          put_originals_with_copies = true
        else
          put_originals_with_copies = false
        end

        if node[:computed_data][:input].key?(:copies) &&
          Number.valid?(node[:computed_data][:input][:copies])

          copies = Number.parse(node[:computed_data][:input][:copies])

          raise NodeError.new('Copies must be an integer.', node[:id])\
            unless copies.is_a?(Integer)

          # Zero value (0) is allowed to let user disable copy parametrically.
          raise NodeError.new('Copies must be a positive number.', node[:id])\
            if copies < 0

        else
          copies = 1
        end
        
        node[:computed_data][:input][:groups].each do |group|

          if put_originals_with_copies
            node[:computed_data][:output][:groups].push(group)
          else
            node[:computed_data][:output][:original_groups].push(group)
          end

          copies.times do
            node[:computed_data][:output][:groups].push(Group.copy(group))
          end

        end

      end

      node

    end

  end

end

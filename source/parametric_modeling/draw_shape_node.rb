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
require 'parametric_modeling/materials'
require 'parametric_modeling/shapes'
require 'parametric_modeling/node_error'

# Parametric Modeling plugin namespace.
module ParametricModeling

  module DrawShapeNode

    # Computes a node of type "Draw shape".
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

      model = Sketchup.active_model

      if node[:computed_data][:input].key?(:points) &&
        node[:computed_data][:input][:points].is_a?(Array) &&
        !node[:computed_data][:input][:points].empty?
        points = node[:computed_data][:input][:points]
      else
        raise NodeError.new('Points not found.', node[:id])
      end

      if node[:computed_data][:input].key?(:name) &&
        node[:computed_data][:input][:name].is_a?(String)
        name = node[:computed_data][:input][:name]
      else
        name = TRANSLATE['Shape']
      end
      
      if node[:computed_data][:input].key?(:material) &&
        node[:computed_data][:input][:material].is_a?(String) &&
        !node[:computed_data][:input][:material].empty?

        material = model.materials[node[:computed_data][:input][:material]]

        if material.nil?

          material = model.materials.add(node[:computed_data][:input][:material])
          material.color = Materials.rand_color

        end

      else
        material = nil
      end

      if node[:computed_data][:input].key?(:layer) &&
        node[:computed_data][:input][:layer].is_a?(String) &&
        !node[:computed_data][:input][:layer].empty?

        layer = model.layers[node[:computed_data][:input][:layer]]

        if layer.nil?
          layer = model.layers.add(node[:computed_data][:input][:layer])
        end

      else
        layer = nil
      end

      node[:computed_data][:output][:groups] = [
        Shapes.draw_shape(points, name, material, layer)
      ]

      node

    end

  end

end

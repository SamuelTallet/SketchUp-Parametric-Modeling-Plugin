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

require 'parametric_modeling/draw_box_node'
require 'parametric_modeling/draw_prism_node'
require 'parametric_modeling/draw_cylinder_node'
require 'parametric_modeling/draw_tube_node'
require 'parametric_modeling/draw_pyramid_node'
require 'parametric_modeling/draw_cone_node'
require 'parametric_modeling/draw_sphere_node'
require 'parametric_modeling/draw_shape_node'
require 'parametric_modeling/number_node'
require 'parametric_modeling/add_node'
require 'parametric_modeling/subtract_node'
require 'parametric_modeling/multiply_node'
require 'parametric_modeling/divide_node'
require 'parametric_modeling/calculate_node'
require 'parametric_modeling/point_node'
require 'parametric_modeling/get_points_node'
require 'parametric_modeling/vector_node'
require 'parametric_modeling/intersect_solids_node'
require 'parametric_modeling/unite_solids_node'
require 'parametric_modeling/subtract_solids_node'
require 'parametric_modeling/pushpull_node'
require 'parametric_modeling/move_node'
require 'parametric_modeling/align_node'
require 'parametric_modeling/rotate_node'
require 'parametric_modeling/scale_node'
require 'parametric_modeling/paint_node'
require 'parametric_modeling/tag_node'
require 'parametric_modeling/erase_node'
require 'parametric_modeling/copy_node'
require 'parametric_modeling/concatenate_node'
require 'parametric_modeling/select_node'
require 'parametric_modeling/make_group_node'
require 'parametric_modeling/node_error'

# Parametric Modeling plugin namespace.
module ParametricModeling

  module Node

    # Computes a node only one time.
    #
    # @param [Hash] node
    # @raise [ArgumentError]
    #
    # @raise [NodeError]
    #
    # @return [Hash] Node's computed data.
    def self.compute_once(node)

      raise ArgumentError, 'Node must be a Hash.'\
        unless node.is_a?(Hash)

      return node[:computed_data] if node[:computed?]

      # Sometimes, data are stored in node itself.
      node[:computed_data][:input] = node[:data]

      if !node[:inputs].empty?

        node[:inputs].each do |node_input_key, node_input|

          node_input[:connections].each do |node_input_connection|

            connected_input_node_computed_data = compute_once(
              SESSION[:nodes][node_input_connection[:node].to_s.to_sym]
            )

            # Output of input node becomes input of current node.
            node[:computed_data][:input][node_input_key.to_sym] =\
              connected_input_node_computed_data[:output][
                node_input_connection[:output].to_sym
              ]

          end

        end

      end

      case node[:name]

      when 'Draw box'
        node = DrawBoxNode.compute(node)
      when 'Draw prism'
        node = DrawPrismNode.compute(node)
      when 'Draw cylinder'
        node = DrawCylinderNode.compute(node)
      when 'Draw tube'
        node = DrawTubeNode.compute(node)
      when 'Draw pyramid'
        node = DrawPyramidNode.compute(node)
      when 'Draw cone'
        node = DrawConeNode.compute(node)
      when 'Draw sphere'
        node = DrawSphereNode.compute(node)
      when 'Draw shape'
        node = DrawShapeNode.compute(node)
      when 'Number'
        node = NumberNode.compute(node)
      when 'Add'
        node = AddNode.compute(node)
      when 'Subtract'
        node = SubtractNode.compute(node)
      when 'Multiply'
        node = MultiplyNode.compute(node)
      when 'Divide'
        node = DivideNode.compute(node)
      when 'Calculate'
        node = CalculateNode.compute(node)
      when 'Point'
        node = PointNode.compute(node)
      when 'Get points'
        node = GetPointsNode.compute(node)
      when 'Vector'
        node = VectorNode.compute(node)
      when 'Intersect solids'
        node = IntersectSolidsNode.compute(node)
      when 'Unite solids'
        node = UniteSolidsNode.compute(node)
      when 'Subtract solids'
        node = SubtractSolidsNode.compute(node)
      when 'Push/Pull'
        node = PushPullNode.compute(node)
      when 'Move'
        node = MoveNode.compute(node)
      when 'Align'
        node = AlignNode.compute(node)
      when 'Rotate'
        node = RotateNode.compute(node)
      when 'Scale'
        node = ScaleNode.compute(node)
      when 'Paint'
        node = PaintNode.compute(node)
      when 'Tag'
        node = TagNode.compute(node)
      when 'Erase'
        node = EraseNode.compute(node)
      when 'Copy'
        node = CopyNode.compute(node)
      when 'Concatenate'
        node = ConcatenateNode.compute(node)
      when 'Select'
        node = SelectNode.compute(node)
      when 'Make group'
        node = MakeGroupNode.compute(node)
      else

        raise NodeError.new('Unsupported node type: ' + node[:name], node[:id])\
          if node[:name] != 'Comment'

      end

      node[:computed?] = true

      node[:computed_data]
      
    end

  end

end

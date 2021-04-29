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

  # SketchUp edges.
  module Edges

    # Gets points of one or many edges.
    #
    # @param [Array<Sketchup::Edge>] edges
    # @raise [ArgumentError]
    #
    # @return [Array] Points grouped by edge.
    def self.points(edges)

      raise ArgumentError, 'Edges must be an Array.'\
        unless edges.is_a?(Array)

      edges_points = []

      edges.each do |edge|

        edge_points = []
        edge_start_point = edge.start.position
        edge_end_point = edge.end.position

        edge_points.push([

          Number.from_ul(edge_start_point.x),
          Number.from_ul(edge_start_point.y),
          Number.from_ul(edge_start_point.z)
          
        ])

        edge_points.push([

          Number.from_ul(edge_end_point.x),
          Number.from_ul(edge_end_point.y),
          Number.from_ul(edge_end_point.z)
          
        ])

        edges_points.push(edge_points)

      end

      edges_points

    end

  end

end

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

# Parametric Modeling plugin namespace.
module ParametricModeling

  module ConcatenateNode

    # Computes a node of type "Concatenate".
    #
    # @param [Hash] node
    # @raise [ArgumentError]
    #
    # @return [Hash] Node
    def self.compute(node)

      raise ArgumentError, 'Node must be a Hash.'\
        unless node.is_a?(Hash)

      node[:computed_data][:output][:groups] = []

      if ( node[:computed_data][:input].key?(:groups1) &&
        node[:computed_data][:input][:groups1].is_a?(Array) &&
        !node[:computed_data][:input][:groups1].empty? ) ||
        ( node[:computed_data][:input].key?(:groups2) &&
        node[:computed_data][:input][:groups2].is_a?(Array) &&
        !node[:computed_data][:input][:groups2].empty? ) ||
        ( node[:computed_data][:input].key?(:groups3) &&
        node[:computed_data][:input][:groups3].is_a?(Array) &&
        !node[:computed_data][:input][:groups3].empty? ) ||
        ( node[:computed_data][:input].key?(:groups4) &&
        node[:computed_data][:input][:groups4].is_a?(Array) &&
        !node[:computed_data][:input][:groups4].empty? ) ||
        ( node[:computed_data][:input].key?(:groups5) &&
        node[:computed_data][:input][:groups5].is_a?(Array) &&
        !node[:computed_data][:input][:groups5].empty? ) ||
        ( node[:computed_data][:input].key?(:groups6) &&
        node[:computed_data][:input][:groups6].is_a?(Array) &&
        !node[:computed_data][:input][:groups6].empty? ) ||
        ( node[:computed_data][:input].key?(:groups7) &&
        node[:computed_data][:input][:groups7].is_a?(Array) &&
        !node[:computed_data][:input][:groups7].empty? ) ||
        ( node[:computed_data][:input].key?(:groups8) &&
        node[:computed_data][:input][:groups8].is_a?(Array) &&
        !node[:computed_data][:input][:groups8].empty? ) ||
        ( node[:computed_data][:input].key?(:groups9) &&
        node[:computed_data][:input][:groups9].is_a?(Array) &&
        !node[:computed_data][:input][:groups9].empty? ) ||
        ( node[:computed_data][:input].key?(:groups10) &&
        node[:computed_data][:input][:groups10].is_a?(Array) &&
        !node[:computed_data][:input][:groups10].empty? ) ||
        ( node[:computed_data][:input].key?(:groups11) &&
        node[:computed_data][:input][:groups11].is_a?(Array) &&
        !node[:computed_data][:input][:groups11].empty? ) ||
        ( node[:computed_data][:input].key?(:groups12) &&
        node[:computed_data][:input][:groups12].is_a?(Array) &&
        !node[:computed_data][:input][:groups12].empty? )
          
        groups = []

        if node[:computed_data][:input].key?(:groups1) &&
          node[:computed_data][:input][:groups1].is_a?(Array) &&
          !node[:computed_data][:input][:groups1].empty?
          groups = groups.concat(node[:computed_data][:input][:groups1])
        end

        if node[:computed_data][:input].key?(:groups2) &&
          node[:computed_data][:input][:groups2].is_a?(Array) &&
          !node[:computed_data][:input][:groups2].empty?
          groups = groups.concat(node[:computed_data][:input][:groups2])
        end

        if node[:computed_data][:input].key?(:groups3) &&
          node[:computed_data][:input][:groups3].is_a?(Array) &&
          !node[:computed_data][:input][:groups3].empty?
          groups = groups.concat(node[:computed_data][:input][:groups3])
        end

        if node[:computed_data][:input].key?(:groups4) &&
          node[:computed_data][:input][:groups4].is_a?(Array) &&
          !node[:computed_data][:input][:groups4].empty?
          groups = groups.concat(node[:computed_data][:input][:groups4])
        end

        if node[:computed_data][:input].key?(:groups5) &&
          node[:computed_data][:input][:groups5].is_a?(Array) &&
          !node[:computed_data][:input][:groups5].empty?
          groups = groups.concat(node[:computed_data][:input][:groups5])
        end

        if node[:computed_data][:input].key?(:groups6) &&
          node[:computed_data][:input][:groups6].is_a?(Array) &&
          !node[:computed_data][:input][:groups6].empty?
          groups = groups.concat(node[:computed_data][:input][:groups6])
        end

        if node[:computed_data][:input].key?(:groups7) &&
          node[:computed_data][:input][:groups7].is_a?(Array) &&
          !node[:computed_data][:input][:groups7].empty?
          groups = groups.concat(node[:computed_data][:input][:groups7])
        end

        if node[:computed_data][:input].key?(:groups8) &&
          node[:computed_data][:input][:groups8].is_a?(Array) &&
          !node[:computed_data][:input][:groups8].empty?
          groups = groups.concat(node[:computed_data][:input][:groups8])
        end

        if node[:computed_data][:input].key?(:groups9) &&
          node[:computed_data][:input][:groups9].is_a?(Array) &&
          !node[:computed_data][:input][:groups9].empty?
          groups = groups.concat(node[:computed_data][:input][:groups9])
        end

        if node[:computed_data][:input].key?(:groups10) &&
          node[:computed_data][:input][:groups10].is_a?(Array) &&
          !node[:computed_data][:input][:groups10].empty?
          groups = groups.concat(node[:computed_data][:input][:groups10])
        end

        if node[:computed_data][:input].key?(:groups11) &&
          node[:computed_data][:input][:groups11].is_a?(Array) &&
          !node[:computed_data][:input][:groups11].empty?
          groups = groups.concat(node[:computed_data][:input][:groups11])
        end

        if node[:computed_data][:input].key?(:groups12) &&
          node[:computed_data][:input][:groups12].is_a?(Array) &&
          !node[:computed_data][:input][:groups12].empty?
          groups = groups.concat(node[:computed_data][:input][:groups12])
        end

        node[:computed_data][:output][:groups] = groups
        
      end

      node

    end

  end

end

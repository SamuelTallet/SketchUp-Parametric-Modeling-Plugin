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
require 'parametric_modeling/nodes_editor'
require 'parametric_modeling/node'
require 'parametric_modeling/node_error'

# Parametric Modeling plugin namespace.
module ParametricModeling

  module ParametricEntities

    # Erases all parametric entities.
    def self.erase

      model = Sketchup.active_model

      model.start_operation(TRANSLATE['Erase Parametric Entities'], disable_ui = true)

      model.active_entities.each do |entity|
        entity.erase! if entity.get_attribute(CODE_NAME, 'isParametric') == true
      end

      model.commit_operation

    end

    # Draws all parametric entities depending on Nodes Editor schema.
    def self.draw

      begin

        NodesEditor.tag_nodes_as_valid
          
        model = Sketchup.active_model
        model.start_operation(TRANSLATE['Draw Parametric Entities'], disable_ui = true)
        
        SESSION[:nodes] = NodesEditor.schema[:nodes]

        SESSION[:nodes].each_value do |node|

          node[:computed?] = false
          
          node[:computed_data] = {
            input: {},
            output: {}
          }
          
        end

        SESSION[:nodes].each_value { |node| Node.compute_once(node) }

        model.commit_operation

      rescue NodeError => node_error
      
        model.abort_operation
        NodesEditor.tag_node_as_invalid(node_error.node_id.to_i)

      end

    end

    # Redraws all parametric entities depending on Nodes Editor schema.
    def self.redraw

      erase
      draw

    end

    # Freezes all parametric entities.
    def self.freeze

      Sketchup.active_model.active_entities.each do |entity|
        entity.delete_attribute(CODE_NAME, 'isParametric')
      end

    end

  end

end

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
require 'parametric_modeling/utils'

# Parametric Modeling plugin namespace.
module ParametricModeling

  # Connects this plugin context menu to SketchUp user interface.
  module ContextMenu

    # Adds context menu.
    def self.add

      UI.add_context_menu_handler do |context_menu|

        model = Sketchup.active_model

        if !model.selection.empty?

          context_menu_submenu = context_menu.add_submenu(NAME)

          context_menu_submenu.add_item('Extract Vector From Face Normal') do
            
            faces = model.selection.grep(Sketchup::Face)

            if faces.empty?
              UI.messagebox('Error: No face found in selection.')
            else

              faces.each do |face|

                face_normal = face.normal

                add_node_status = NodesEditor.add_node(
                  'Vector',
                  {
                    x: face_normal.x, y: face_normal.y, z: face_normal.z
                  }
                )

                UI.messagebox('Error: Nodes Editor is not open.')\
                  if add_node_status == false

              end

            end

          end

          context_menu_submenu.add_item('Extract Point From Construction Point') do

            construction_points = model.selection.grep(Sketchup::ConstructionPoint)

            if construction_points.empty?
              UI.messagebox('Error: No construction point found in selection.')
            else

              construction_points.each do |construction_point|

                construction_point_position = construction_point.position

                add_node_status = NodesEditor.add_node(
                  'Point',
                  {
                    x: Utils.ul2num(construction_point_position.x),
                    y: Utils.ul2num(construction_point_position.y),
                    z: Utils.ul2num(construction_point_position.z)
                  }
                )

                UI.messagebox('Error: Nodes Editor is not open.')\
                  if add_node_status == false

              end

            end

          end

        end

      end

    end

  end

end
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
require 'fileutils'
require 'json'
require 'parametric_modeling/materials'
require 'parametric_modeling/layers'
require 'parametric_modeling/html_dialogs'
require 'parametric_modeling/parametric_entities'

# Parametric Modeling plugin namespace.
module ParametricModeling

  # Nodes Editor of this plugin.
  class NodesEditor

    # Nodes Editor schema version. Not to be confused with version of this plugin.
    SCHEMA_VERSION = '1.0.0'

    # Opens Nodes Editor.
    def self.open

      if SESSION[:nodes_editor][:html_dialog_open?]

        raise 'Parametric Modeling Nodes Editor HTML Dialog instance is missing.'\
          if SESSION[:nodes_editor][:html_dialog].nil?

        SESSION[:nodes_editor][:html_dialog].bring_to_front

      else
        self.new.show
      end

    end

    # Gets Nodes Editor HTML code.
    #
    # @return [String]
    def self.html

      HTMLDialogs.merge(

        # Note: Paths below are relative to `HTMLDialogs::DIR`.
        document: 'nodes-editor.rhtml',
        scripts: [
          'libraries/pep.min.js',
          'libraries/lodash.min.js',
          'libraries/vue.min.js',
          'libraries/rete.min.js',
          'libraries/rete/vue-render-plugin.min.js',
          'libraries/rete/connection-plugin.min.js',
          'libraries/rete/minimap-plugin.min.js',
          'libraries/drooltip.js',
          'libraries/context-menu.js',
          'nodes-editor.js'
        ],
        styles: [
          'libraries/drooltip.css',
          'nodes-editor.css'
        ]

      )

    end

    # Reloads Nodes Editor.
    #
    # @return [Boolean]
    def self.reload

      if SESSION[:nodes_editor][:html_dialog_open?]

        raise 'Parametric Modeling Nodes Editor HTML Dialog instance is missing.'\
          if SESSION[:nodes_editor][:html_dialog].nil?

        SESSION[:nodes_editor][:html_dialog].set_html(html)

        return true

      end

      false

    end

    # Gets Nodes Editor translation.
    #
    # @return [Hash]
    def self.translation

      {

        "Number": TRANSLATE['Number'],
        "Groups": TRANSLATE['Groups'],
        "Point": TRANSLATE['Point'],
        "Vector": TRANSLATE['Vector'],
        "Material...": TRANSLATE['Material...'],
        "Tag/Layer...": TRANSLATE[Sketchup.version.to_i >= 20 ? 'Tag...' : 'Layer...'],
        "Width": TRANSLATE['Width'],
        "Depth": TRANSLATE['Depth'],
        "Height": TRANSLATE['Height'],
        "Group": TRANSLATE['Group'],
        "Name": TRANSLATE['Name'],
        "Radius": TRANSLATE['Radius'],
        "Sides": TRANSLATE['Sides'],
        "Segments": TRANSLATE['Segments'],
        "Thickness": TRANSLATE['Thickness'],
        "Label": TRANSLATE['Label'],
        "Dividend": TRANSLATE['Dividend'],
        "Divisor": TRANSLATE['Divisor'],
        "Quotient": TRANSLATE['Quotient'],
        "Remainder": TRANSLATE['Remainder'],
        "Variable A": TRANSLATE['Variable A'],
        "Variable B": TRANSLATE['Variable B'],
        "Variable C": TRANSLATE['Variable C'],
        "Variable D": TRANSLATE['Variable D'],
        "Variable E": TRANSLATE['Variable E'],
        "Variable F": TRANSLATE['Variable F'],
        "Variable G": TRANSLATE['Variable G'],
        "Variable H": TRANSLATE['Variable H'],
        "Variable I": TRANSLATE['Variable I'],
        "Variable J": TRANSLATE['Variable J'],
        "Variable K": TRANSLATE['Variable K'],
        "Variable L": TRANSLATE['Variable L'],
        "Formula example:": TRANSLATE['Formula example:'],
        "Distance": TRANSLATE['Distance'],
        "Direction": TRANSLATE['Direction'],
        "Increment distance": TRANSLATE['Increment distance'],
        "Position": TRANSLATE['Position'],
        "Position is absolute": TRANSLATE['Position is absolute'],
        "Center": TRANSLATE['Center'],
        "Axis": TRANSLATE['Axis'],
        "Angle": TRANSLATE['Angle'],
        "X factor": TRANSLATE['X factor'],
        "Y factor": TRANSLATE['Y factor'],
        "Z factor": TRANSLATE['Z factor'],
        "Copies": TRANSLATE['Copies'],
        "Copied groups": TRANSLATE['Copied groups'],
        "Original groups": TRANSLATE['Original groups'],
        "Put originals with copies": TRANSLATE['Put originals with copies'],
        "Matching groups": TRANSLATE['Matching groups'],
        "Not matching groups": TRANSLATE['Not matching groups'],
        "Query example:": TRANSLATE['Query example:'],
        "Draw box": TRANSLATE['Draw box'],
        "Draw prism": TRANSLATE['Draw prism'],
        "Draw cylinder": TRANSLATE['Draw cylinder'],
        "Draw tube": TRANSLATE['Draw tube'],
        "Draw pyramid": TRANSLATE['Draw pyramid'],
        "Draw cone": TRANSLATE['Draw cone'],
        "Draw sphere": TRANSLATE['Draw sphere'],
        "Add": TRANSLATE['Add'],
        "Subtract": TRANSLATE['Subtract'],
        "Multiply": TRANSLATE['Multiply'],
        "Divide": TRANSLATE['Divide'],
        "Calculate": TRANSLATE['Calculate'],
        "Intersect solids": TRANSLATE['Intersect solids'],
        "Unite solids": TRANSLATE['Unite solids'],
        "Subtract solids": TRANSLATE['Subtract solids'],
        "Push/Pull": TRANSLATE['Push/Pull'],
        "Move": TRANSLATE['Move'],
        "Rotate": TRANSLATE['Rotate'],
        "Scale": TRANSLATE['Scale'],
        "Paint": TRANSLATE['Paint'],
        "Tag": TRANSLATE[Sketchup.version.to_i >= 20 ? 'Tag' : 'Assign layer'],
        "Erase": TRANSLATE['Erase'],
        "Copy": TRANSLATE['Copy'],
        "Concatenate": TRANSLATE['Concatenate'],
        "Select": TRANSLATE['Select'],
        "Make group": TRANSLATE['Make group'],
        "Remove this node": TRANSLATE['Remove this node'],
        "Draw shape": TRANSLATE['Draw shape'],
        "Import schema from a file": TRANSLATE['Import schema from a file'],
        "Export schema to a file": TRANSLATE['Export schema to a file'],
        "Freeze parametric entities": TRANSLATE['Freeze parametric entities'],
        "Show or hide minimap": TRANSLATE['Show or hide minimap'],
        "Remove all nodes": TRANSLATE['Remove all nodes']

      }

    end

    # Gets Nodes Editor icons.
    #
    # @return [Hash]
    def self.icons

      images_dir = File.join(HTMLDialogs::DIR, 'images')

      {

        nodes: {

          "Draw box": {
            path: File.join(images_dir, 'draw-box-node-icon.svg'),
            color: 'rgba(30, 227, 165, 0.5)'
          },

          "Draw prism": {
            path: File.join(images_dir, 'draw-prism-node-icon.svg'),
            color: 'rgba(255, 106, 46, 0.5)'
          },

          "Draw cylinder": {
            path: File.join(images_dir, 'draw-cylinder-node-icon.svg'),
            color: 'rgba(252, 123, 214, 0.5)'
          },

          "Draw tube": {
            path: File.join(images_dir, 'draw-tube-node-icon.svg'),
            color: 'rgba(252, 220, 25, 0.5)'
          },

          "Draw pyramid": {
            path: File.join(images_dir, 'draw-pyramid-node-icon.svg'),
            color: 'rgba(252, 223, 43, 0.5)'
          },

          "Draw cone": {
            path: File.join(images_dir, 'draw-cone-node-icon.svg'),
            color: 'rgba(252, 231, 103, 0.5)'
          },

          "Draw sphere": {
            path: File.join(images_dir, 'draw-sphere-node-icon.svg'),
            color: 'rgba(133, 164, 255, 0.5)'
          },

          "Draw shape": {
            path: File.join(images_dir, 'draw-shape-node-icon.svg'),
            color: 'rgba(252, 220, 25, 0.5)'
          },

          "Number": {
            path: File.join(images_dir, 'number-node-icon.svg'),
            color: 'rgba(0, 140, 189, 0.5)'
          },

          "Add": {
            path: File.join(images_dir, 'add-node-icon.svg'),
            color: 'rgba(125, 210, 240, 0.5)'
          },

          "Subtract": {
            path: File.join(images_dir, 'subtract-node-icon.svg'),
            color: 'rgba(255, 100, 101, 0.5)'
          },

          "Multiply": {
            path: File.join(images_dir, 'multiply-node-icon.svg'),
            color: 'rgba(125, 210, 240, 0.5)'
          },

          "Divide": {
            path: File.join(images_dir, 'divide-node-icon.svg'),
            color: 'rgba(255, 100, 101, 0.5)'
          },

          "Calculate": {
            path: File.join(images_dir, 'calculate-node-icon.svg'),
            color: 'rgba(5, 112, 150, 0.5)'
          },

          "Point": {
            path: File.join(images_dir, 'point-node-icon.svg'),
            color: 'rgba(229, 157, 31, 0.5)'
          },

          "Vector": {
            path: File.join(images_dir, 'vector-node-icon.svg'),
            color: 'rgba(229, 56, 4, 0.5)'
          },

          "Intersect solids": {
            path: File.join(images_dir, 'intersect-solids-node-icon.svg'),
            color: 'rgba(156, 129, 238, 0.5)'
          },

          "Unite solids": {
            path: File.join(images_dir, 'unite-solids-node-icon.svg'),
            color: 'rgba(125, 210, 240, 0.5)'
          },

          "Subtract solids": {
            path: File.join(images_dir, 'subtract-solids-node-icon.svg'),
            color: 'rgba(255, 100, 101, 0.5)'
          },

          "Push/Pull": {
            path: File.join(images_dir, 'push-pull-node-icon.svg'),
            color: 'rgba(29, 131, 212, 0.5)'
          },

          "Move": {
            path: File.join(images_dir, 'move-node-icon.svg'),
            color: 'rgba(255, 128, 191, 0.5)'
          },

          "Rotate": {
            path: File.join(images_dir, 'rotate-node-icon.svg'),
            color: 'rgba(255, 215, 0, 0.5)'
          },

          "Scale": {
            path: File.join(images_dir, 'scale-node-icon.svg'),
            color: 'rgba(153, 204, 0, 0.5)'
          },

          "Paint": {
            path: File.join(images_dir, 'paint-node-icon.svg'),
            color: 'rgba(0, 206, 209, 0.5)'
          },

          "Tag": {
            path: File.join(images_dir, 'tag-node-icon.svg'),
            color: 'rgba(235, 176, 68, 0.5)'
          },

          "Erase": {
            path: File.join(images_dir, 'erase-node-icon.svg'),
            color: 'rgba(128, 180, 251, 0.5)'
          },

          "Copy": {
            path: File.join(images_dir, 'copy-node-icon.svg'),
            color: 'rgba(160, 160, 165, 0.5)'
          },

          "Concatenate": {
            path: File.join(images_dir, 'concatenate-node-icon.svg'),
            color: 'rgba(255, 209, 91, 0.5)'
          },

          "Select": {
            path: File.join(images_dir, 'select-node-icon.svg'),
            color: 'rgba(204, 164, 0, 0.5)'
          },

          "Make group": {
            path: File.join(images_dir, 'make-group-node-icon.svg'),
            color: 'rgba(0, 0, 0, 0.8)'
          }

        },

        help: {
          path: File.join(images_dir, 'help-icon.svg'),
          title: TRANSLATE['Access online help']
        }

      }

    end

    # Gets Nodes Editor schema.
    #
    # @return [Hash]
    def self.schema

      schema_json = Sketchup.active_model.get_attribute(CODE_NAME, 'schema')

      if schema_json.nil?

        # Empty schema.
        return {
          id: CODE_NAME + '@' + SCHEMA_VERSION,
          nodes: {}
        }

      end

      JSON.parse(schema_json, { symbolize_names: true })

    end

    # Sets Nodes Editor schema.
    #
    # @param [String] schema_json
    # @raise [ArgumentError]
    def self.schema=(schema_json)

      raise ArgumentError, 'Schema JSON must be a String.'\
        unless schema_json.is_a?(String)

      begin

        candidate_schema = JSON.parse(schema_json)

        return UI.messagebox(TRANSLATE['Error: Nodes Editor schema is incompatible.'])\
          if candidate_schema['id'] != CODE_NAME + '@' + SCHEMA_VERSION

        Sketchup.active_model.set_attribute(CODE_NAME, 'schema', schema_json)

      rescue
        UI.messagebox(TRANSLATE['Error: Nodes Editor schema is invalid.'])
      end

    end

    # Imports Nodes Editor schema from file.
    def self.import_schema_from_file

      schema_file = UI.openpanel(
        TRANSLATE['Open Schema File'],
        File.join(__dir__, 'Schemas'),
        TRANSLATE['Schema Files'] + '|*.schema||'
      )

      # Exit if user canceled...
      return if schema_file.nil?

      self.schema = File.read(schema_file)

    end

    # Exports Nodes Editor schema to file.
    def self.export_schema_to_file

      if !Sketchup.active_model.path.empty?
        schema_filename = File.basename(Sketchup.active_model.path).sub('.skp', '.schema')
      else
        schema_filename = TRANSLATE['Untitled model'] + '.schema'
      end

      schema_file = UI.savepanel(
        TRANSLATE['Save Schema File'],
        File.join(__dir__, 'Schemas'),
        schema_filename
      )

      # Exit if user canceled...
      return if schema_file.nil?

      File.write(schema_file, JSON.pretty_generate(schema))

      UI.messagebox(
        TRANSLATE['Parametric Modeling schema successfully exported here:'] + ' ' + schema_file
      )

    end

    # Tags all nodes as valid in Editor.
    #
    # @return [Boolean]
    def self.tag_nodes_as_valid

      if SESSION[:nodes_editor][:html_dialog_open?]

        raise 'Parametric Modeling Nodes Editor HTML Dialog instance is missing.'\
          if SESSION[:nodes_editor][:html_dialog].nil?

        SESSION[:nodes_editor][:html_dialog].execute_script(
          'PMG.NodesEditor.tagNodesAsValid()'
        )

        return true

      end

      false

    end

    # Tags a node as invalid in Editor.
    #
    # @param [Integer] node_id
    # @raise [ArgumentError]
    #
    # @return [Boolean]
    def self.tag_node_as_invalid(node_id)

      raise ArgumentError, 'Node ID must be an Integer.'\
        unless node_id.is_a?(Integer)

      if SESSION[:nodes_editor][:html_dialog_open?]

        raise 'Parametric Modeling Nodes Editor HTML Dialog instance is missing.'\
          if SESSION[:nodes_editor][:html_dialog].nil?

        SESSION[:nodes_editor][:html_dialog].execute_script(
          'PMG.NodesEditor.tagNodeAsInvalid(' + node_id.to_s + ')'
        )

        return true

      end

      false

    end

    # Adds a node to Editor.
    #
    # @param [String] node_name
    # @param [Hash] node_data
    # @raise [ArgumentError]
    #
    # @return [Boolean]
    def self.add_node(node_name, node_data)

      raise ArgumentError, 'Node name must be a String.'\
        unless node_name.is_a?(String)

      raise ArgumentError, 'Node data must be a Hash.'\
        unless node_data.is_a?(Hash)

      if SESSION[:nodes_editor][:html_dialog_open?]

        raise 'Parametric Modeling Nodes Editor HTML Dialog instance is missing.'\
          if SESSION[:nodes_editor][:html_dialog].nil?

        SESSION[:nodes_editor][:html_dialog].execute_script(
          'PMG.NodesEditor.addNode("' + node_name + '", ' + node_data.to_json + ')'
        )

        return true

      end

      false

    end

    # Builds Nodes Editor.
    def initialize

      @html_dialog = create_html_dialog

      SESSION[:nodes_editor][:html_dialog] = @html_dialog

      fill_html_dialog

      configure_html_dialog

    end

    # Shows Nodes Editor.
    def show

      @html_dialog.show

      # Nodes Editor is open.
      SESSION[:nodes_editor][:html_dialog_open?] = true

    end

    # Creates SketchUp HTML dialog that powers Nodes Editor of this plugin.
    #
    # @return [UI::HtmlDialog] HTML dialog.
    private def create_html_dialog

      UI::HtmlDialog.new(
        dialog_title:     TRANSLATE['Nodes Editor'] + ' - ' + NAME,
        preferences_key:  CODE_NAME,
        scrollable:       true,
        width:            640,
        height:           490,
        min_width:        640,
        min_height:       490
      )

    end

    # Fills HTML dialog.
    private def fill_html_dialog
      @html_dialog.set_html(self.class.html)
    end

    # Configures HTML dialog.
    private def configure_html_dialog

      @html_dialog.add_action_callback('importSchemaFromFile') do |_ctx|

        self.class.import_schema_from_file

        self.class.reload
        ParametricEntities.redraw

      end

      @html_dialog.add_action_callback('exportSchemaToFile') do |_ctx|
        self.class.export_schema_to_file
      end

      @html_dialog.add_action_callback('freezeParametricEntities') do |_ctx|
        ParametricEntities.freeze
      end

      @html_dialog.add_action_callback('exportModelSchema') do |_ctx, schema_json, redraw|

        self.class.schema = schema_json
        ParametricEntities.redraw if redraw

      end

      @html_dialog.add_action_callback('accessOnlineHelp') do |_ctx|
        UI.openURL(
          'https://github.com/SamuelTS/SketchUp-Parametric-Modeling-Plugin#nodes-editor'
        )
      end

      @html_dialog.set_on_closed { SESSION[:nodes_editor][:html_dialog_open?] = false }

      @html_dialog.center

    end

  end

end

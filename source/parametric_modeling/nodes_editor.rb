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
          'libraries/context-menu.js',
          'nodes-editor.js'
        ],
        styles: [
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

          "Point": {
            path: File.join(images_dir, 'point-node-icon.svg'),
            color: 'rgba(229, 157, 31, 0.5)'
          },

          "Vector": {
            path: File.join(images_dir, 'vector-node-icon.svg'),
            color: 'rgba(229, 56, 4, 0.5)'
          },

          "Push/Pull": {
            path: File.join(images_dir, 'push-pull-node-icon.svg'),
            color: 'rgba(29, 131, 212, 0.5)'
          },

          "Move": {
            path: File.join(images_dir, 'move-node-icon.svg'),
            color: 'rgba(235, 129, 161, 0.5)'
          },

          "Rotate": {
            path: File.join(images_dir, 'rotate-node-icon.svg'),
            color: 'rgba(51, 141, 239, 0.5)'
          },

          "Scale": {
            path: File.join(images_dir, 'scale-node-icon.svg'),
            color: 'rgba(86, 196, 240, 0.5)'
          },

          "Copy": {
            path: File.join(images_dir, 'copy-node-icon.svg'),
            color: 'rgba(160, 160, 165, 0.5)'
          }

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

        return UI.messagebox('Error: Nodes Editor schema is incompatible.')\
          if candidate_schema['id'] != CODE_NAME + '@' + SCHEMA_VERSION

        Sketchup.active_model.set_attribute(CODE_NAME, 'schema', schema_json)

      rescue
        UI.messagebox('Error: Nodes Editor schema is invalid.')
      end

    end

    # Imports Nodes Editor schema from file.
    def self.import_schema_from_file

      schema_file = UI.openpanel(
        'Open Schema File',
        File.join(__dir__, 'Schemas'),
        'Schema Files|*.schema||'
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
        schema_filename = 'Untitled model.schema'
      end

      schema_file = UI.savepanel(
        'Save Schema File',
        File.join(__dir__, 'Schemas'),
        schema_filename
      )

      # Exit if user canceled...
      return if schema_file.nil?

      File.write(schema_file, schema.to_json)

      UI.messagebox('Parametric Modeling schema successfully exported here: ' + schema_file)

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
        dialog_title:     'Nodes Editor' + ' - ' + NAME,
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

      @html_dialog.add_action_callback('redrawParametricEntities') do |_ctx, schema_json|

        self.class.schema = schema_json
        ParametricEntities.redraw

      end

      @html_dialog.set_on_closed { SESSION[:nodes_editor][:html_dialog_open?] = false }

      @html_dialog.center

    end

  end

end

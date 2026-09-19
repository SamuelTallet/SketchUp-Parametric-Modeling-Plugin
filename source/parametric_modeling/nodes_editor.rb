# Parametric Modeling extension for SketchUp.
# Copyright: © 2026 Samuel Tallet <samuel.tallet arobase gmail.com>
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

    # Built Nodes Editor frontend. See "Nodes Editor" directory for its sources.
    # While developing, `npm run watch` there rebuilds this file on each change:
    # close and reopen Nodes Editor to load the new build.
    HTML_FILE = 'nodes-editor.html'

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
      HTMLDialogs.read(HTML_FILE)
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

    # Gets data Nodes Editor frontend needs at startup.
    # Frontend requests it with `ready` callback and receives it via `PMG.NodesEditor.boot`.
    #
    # @return [Hash]
    def self.bootstrap

      {
        locale: Sketchup.get_locale,
        sketchupVersion: Sketchup.version.to_i,
        schemaVersion: SCHEMA_VERSION,
        translation: translation,
        materials: Materials.list,
        layers: Layers.list,
        schema: schema
      }

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
        "Parent point": TRANSLATE['Parent point'],
        "Increment inherited XYZ": TRANSLATE['Increment inherited XYZ'],
        "Front bottom left": TRANSLATE['Front bottom left'],
        "Front bottom center": TRANSLATE['Front bottom center'],
        "Front bottom right": TRANSLATE['Front bottom right'],
        "Front center": TRANSLATE['Front center'],
        "Front top left": TRANSLATE['Front top left'],
        "Front top center": TRANSLATE['Front top center'],
        "Front top right": TRANSLATE['Front top right'],
        "Bottom center": TRANSLATE['Bottom center'],
        "Left bottom center": TRANSLATE['Left bottom center'],
        "Left center": TRANSLATE['Left center'],
        "Left top center": TRANSLATE['Left top center'],
        "Center": TRANSLATE['Center'],
        "Right bottom center": TRANSLATE['Right bottom center'],
        "Right center": TRANSLATE['Right center'],
        "Right top center": TRANSLATE['Right top center'],
        "Top center": TRANSLATE['Top center'],
        "Back bottom left": TRANSLATE['Back bottom left'],
        "Back bottom center": TRANSLATE['Back bottom center'],
        "Back bottom right": TRANSLATE['Back bottom right'],
        "Back center": TRANSLATE['Back center'],
        "Back top left": TRANSLATE['Back top left'],
        "Back top center": TRANSLATE['Back top center'],
        "Back top right": TRANSLATE['Back top right'],
        "Distance": TRANSLATE['Distance'],
        "Direction": TRANSLATE['Direction'],
        "Increment distance": TRANSLATE['Increment distance'],
        "Position": TRANSLATE['Position'],
        "X position. Example:": TRANSLATE['X position. Example:'],
        "X position": TRANSLATE['X position'],
        "Y position. Example:": TRANSLATE['Y position. Example:'],
        "Y position": TRANSLATE['Y position'],
        "Z position. Example:": TRANSLATE['Z position. Example:'],
        "Z position": TRANSLATE['Z position'],
        "Position is absolute": TRANSLATE['Position is absolute'],
        "Origin": TRANSLATE['Origin'],
        "Target": TRANSLATE['Target'],
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
        "Get points": TRANSLATE['Get points'],
        "Intersect solids": TRANSLATE['Intersect solids'],
        "Unite solids": TRANSLATE['Unite solids'],
        "Subtract solids": TRANSLATE['Subtract solids'],
        "Push/Pull": TRANSLATE['Push/Pull'],
        "Move": TRANSLATE['Move'],
        "Align": TRANSLATE['Align'],
        "Rotate": TRANSLATE['Rotate'],
        "Scale": TRANSLATE['Scale'],
        "Paint": TRANSLATE['Paint'],
        "Tag": TRANSLATE[Sketchup.version.to_i >= 20 ? 'Tag' : 'Assign layer'],
        "Erase": TRANSLATE['Erase'],
        "Copy": TRANSLATE['Copy'],
        "Concatenate": TRANSLATE['Concatenate'],
        "Select": TRANSLATE['Select'],
        "Make group": TRANSLATE['Make group'],
        "Comment": TRANSLATE['Comment'],
        "Remove this node": TRANSLATE['Remove this node'],
        "Draw shape": TRANSLATE['Draw shape'],
        "Import schema from a file": TRANSLATE['Import schema from a file'],
        "Export schema to a file": TRANSLATE['Export schema to a file'],
        "Freeze parametric entities": TRANSLATE['Freeze parametric entities'],
        "Show or hide minimap": TRANSLATE['Show or hide minimap'],
        "Add a comment node": TRANSLATE['Add a comment node'],
        "Remove all nodes": TRANSLATE['Remove all nodes'],
        "Access online help": TRANSLATE['Access online help']

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

      @html_dialog.add_action_callback('ready') do |_ctx|
        @html_dialog.execute_script(
          'PMG.NodesEditor.boot(' + self.class.bootstrap.to_json + ')'
        )
      end

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
          'https://github.com/SamuelTallet/SketchUp-Parametric-Modeling-Plugin/wiki/Nodes-Editor'
        )
      end

      @html_dialog.set_on_closed { SESSION[:nodes_editor][:html_dialog_open?] = false }

      @html_dialog.center

    end

  end

end

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
require 'extensions'

$LOAD_PATH.push(File.join(__dir__, 'parametric_modeling', 'Libraries'))

# Parametric Modeling plugin namespace.
module ParametricModeling

  if Sketchup.version.to_i >= 17

    VERSION = '0.0.2'

    CODE_NAME = 'ParametricModeling'
    NAME = 'Parametric Modeling'
  
    # Initialize session storage.
    SESSION = {
      nodes_editor: {
        html_dialog_open?: false,
        html_dialog: nil
      },
      nodes: {}
    }
  
    # Register extension.
  
    extension = SketchupExtension.new(NAME, 'parametric_modeling/load.rb')
  
    extension.version     = VERSION
    extension.creator     = 'Samuel Tallet'
    extension.copyright   = "© 2021 #{extension.creator}"
    
    extension_features = []

    extension_features.push(
      "Do parametric modeling in SketchUp thanks to a " +
      "Nodes Editor similar to Unreal Engine's Blueprints."
    )

    extension_features.push(
      'Modify entities parameters at any time and see result instantly.'
    )

    extension_features.push(
      'Import schema from file. Export schema to file.'
    )

    extension.description = extension_features.join(' ')
  
    Sketchup.register_extension(extension, load_at_start = true)
    
  else
    UI.messagebox('Parametric Modeling plugin requires at least SketchUp 2017.')
  end

end

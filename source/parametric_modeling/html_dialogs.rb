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

require 'fileutils'

# Parametric Modeling plugin namespace.
module ParametricModeling

  # Helps to load HTML dialogs.
  module HTMLDialogs

    # Absolute path to "HTML Dialogs" directory.
    DIR = File.join(__dir__, 'HTML Dialogs')

    # Reads an HTML document.
    #
    # @param [String] document Document path relative to `HTMLDialogs::DIR`.
    # @raise [ArgumentError]
    #
    # @return [String] HTML document contents.
    def self.read(document)

      raise ArgumentError, 'Document must be a String.'\
       unless document.is_a?(String)

      File.read(File.join(DIR, document))

    end

  end

end

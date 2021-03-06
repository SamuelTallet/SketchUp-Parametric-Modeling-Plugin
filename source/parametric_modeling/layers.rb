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

# Parametric Modeling plugin namespace.
module ParametricModeling

  # SketchUp layers.
  module Layers

    # Gets layers list.
    #
    # @return [Array<Hash>]
    def self.list
      
      layers = []

      Sketchup.active_model.layers.each do |layer|

        layers.push({
          name: layer.name,
          display_name: Sketchup.version.to_i >= 20 ? layer.display_name : layer.name
        })

      end

      layers

    end

  end

end

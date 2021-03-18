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

  # Utilities.
  module Utils

    # Converts a number to a length according to model length unit.
    #
    # @param [Integer, Float] number
    # @raise [ArgumentError]
    #
    # @return [Length] Default: meters.
    def self.num2ul(number)

      raise ArgumentError, 'Number must be an Integer or a Float.'\
        unless number.is_a?(Integer) || number.is_a?(Float) 
      
      length_unit = Sketchup.active_model.options['UnitsOptions']['LengthUnit']

      if length_unit == Length::Inches
        number.to_f.inch
      elsif length_unit == Length::Feet
        number.to_f.feet
      elsif length_unit == Length::Millimeter
        number.to_f.mm
      elsif length_unit == Length::Centimeter
        number.to_f.cm
      else
        number.to_f.m
      end

    end

  end

end

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

    # Checks if a number is valid.
    # 
    # @return [Boolean] true if number is valid, false otherwise.
    def self.valid_num?(number)

      return true if number.is_a?(Integer) || number.is_a?(Float)

      return true if number.is_a?(String) && number.match(/^-?(0|[1-9][0-9]*)(\.[0-9]+)?$/)

      false

    end

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
      number = number.to_f

      if length_unit == Length::Inches
        number.inch
      elsif length_unit == Length::Feet
        number.feet
      elsif length_unit == Length::Millimeter
        number.mm
      elsif length_unit == Length::Centimeter
        number.cm
      else
        number.m
      end

    end

    # Converts a length to a number according to model length unit.
    #
    # @param [Length] length
    # @raise [ArgumentError]
    #
    # @return [Float] Default: meters.
    def self.ul2num(length)

      raise ArgumentError, 'Length must be a Length.'\
        unless length.is_a?(Length)
      
      length_unit = Sketchup.active_model.options['UnitsOptions']['LengthUnit']

      if length_unit == Length::Inches
        length.to_inch
      elsif length_unit == Length::Feet
        length.to_feet
      elsif length_unit == Length::Millimeter
        length.to_mm
      elsif length_unit == Length::Centimeter
        length.to_cm
      else
        length.to_m
      end

    end

    # Generates a random color.
    #
    # @return [Sketchup::Color]
    def self.rand_color

      Sketchup::Color.new(
        rand(0..255), # red
        rand(0..255), # green
        rand(0..255) # blue
      )

    end

  end

end

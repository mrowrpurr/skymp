option(USE_SYSTEM_VCPKG "Use vcpkg from your system instead of skymp submodule" OFF)

if(WIN32)
  set(VCPKG_TARGET_TRIPLET "x64-windows-sp")
else()
  set(VCPKG_TARGET_TRIPLET "x64-linux")
endif()

set(VCPKG_OVERLAY_TRIPLETS "${CMAKE_CURRENT_LIST_DIR}/overlay_triplets")
set(VCPKG_OVERLAY_PORTS "${CMAKE_CURRENT_LIST_DIR}/overlay_ports")

macro(set_from_environment VARIABLE)
  if (NOT DEFINED ${VARIABLE} AND DEFINED ENV{${VARIABLE}})
    set(${VARIABLE} $ENV{${VARIABLE}})
  endif ()
endmacro()

set_from_environment(VCPKG_ROOT)

# Use installed VCPKG if exists
if (USE_SYSTEM_VCPKG AND DEFINED VCPKG_ROOT AND EXISTS ${VCPKG_ROOT}/scripts/buildsystems/vcpkg.cmake)
  set(CMAKE_TOOLCHAIN_FILE "${VCPKG_ROOT}/scripts/buildsystems/vcpkg.cmake" CACHE STRING "")
else ()
  set(CMAKE_TOOLCHAIN_FILE "${CMAKE_SOURCE_DIR}/vcpkg/scripts/buildsystems/vcpkg.cmake")
endif ()

# File from vcpkg submodule. This indicates inability to find this file or checkout submodules.
if(NOT EXISTS "${CMAKE_TOOLCHAIN_FILE}")
  set(msg "${CMAKE_TOOLCHAIN_FILE} doesn't exist. It seems that vcpkg submodule is not initialized.")
  set(msg "${msg}\nUse commands below to initialize:")
  set(msg "${msg}\n  git submodule init")
  set(msg "${msg}\n  git submodule update")
  message(FATAL_ERROR "${msg}")
endif()

if(NOT "${CMAKE_BINARY_DIR}" STREQUAL "${CMAKE_SOURCE_DIR}/build")
  set(msg "CMake binary directory must be <repo_root>/build")
  set(msg "${msg}\nUse commands below after cloning the repo (replace path with your actual Skyrim SE folder):")
  set(msg "${msg}\n  mkdir build")
  set(msg "${msg}\n  cd build")
  set(msg "${msg}\nFor users who have Skyrim SE installed:")
  set(msg "${msg}\n  cmake .. -DSKYRIM_DIR=\"C:/Program Files (x86)/Steam/steamapps/common/Skyrim Special Edition\"")
  set(msg "${msg}\nFor users who don't have Skyrim SE installed:")
  set(msg "${msg}\n  cmake ..")
  message(FATAL_ERROR "${msg}")
endif()

cmake_minimum_required(VERSION 3.18.2)
project(skymp)
enable_testing()

# Bool options
option(JS_ENGINE_TRACING_ENABLED "Useful for JsEngine debugging. See JsEngine.h" OFF)
option(ONLY_SP "Build only SkyrimPlatform instead of performing full SkyMP build" OFF)

# P.S. SkyrimPlatform crashes with that JS_ENGINE_TRACING_ENABLED on. See https://github.com/skyrim-multiplayer/skymp/issues/266

if(JS_ENGINE_TRACING_ENABLED)
  add_compile_definitions(JS_ENGINE_TRACING_ENABLED)
endif()

# Path options
option(UNIT_DATA_DIR "Path to directory with Skyrim.esm and other data files required for testing. CMAKE_SOURCE_DIR would be used to resolve a relative path if passed." OFF)
option(SKYRIM_DIR "Path to Skyrim, would be used for tests if UNIT_DATA_DIR is not specified" OFF)
option(CPPCOV_PATH "Path to OpenCppCoverage" OFF)

if(UNIT_DATA_DIR AND NOT IS_ABSOLUTE "${UNIT_DATA_DIR}")
  get_filename_component(UNIT_DATA_DIR "${UNIT_DATA_DIR}" ABSOLUTE BASE_DIR ${CMAKE_SOURCE_DIR})
endif()

if(NOT SKYRIM_DIR)
  message(STATUS "SKYRIM_DIR is not specified. Using prebuilt Papyrus scripts instead of building from sources")
endif()
string(REPLACE "\\" "/" SKYRIM_DIR "${SKYRIM_DIR}")

if(SKYRIM_DIR)
  if (NOT EXISTS ${SKYRIM_DIR}/SkyrimSE.exe)
    message(FATAL_ERROR "Bad SKYRIM_DIR: ${SKYRIM_DIR}")
  endif()
endif()

if(NOT CPPCOV_PATH)
  message(STATUS "CPPCOV_PATH is not specified, coverage would not be calculated")
endif()
string(REPLACE "\\" "/" CPPCOV_PATH "${CPPCOV_PATH}")

if(CPPCOV_PATH)
  if (NOT EXISTS ${CPPCOV_PATH}/OpenCppCoverage.exe)
    message(FATAL_ERROR "Bad CPPCOV_PATH: ${CPPCOV_PATH}")
  endif()
endif()

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_POSITION_INDEPENDENT_CODE ON)

list(APPEND CMAKE_MODULE_PATH ${CMAKE_SOURCE_DIR}/cmake/modules)

add_subdirectory(viet)
add_subdirectory(skyrim-platform)

if(NOT ONLY_SP)
  add_subdirectory(client-deps)
  add_subdirectory(skymp5-client)
  add_subdirectory(skymp5-front)
  add_subdirectory(skymp5-functions-lib)
  add_subdirectory(skymp5-scripts)
  add_subdirectory(skymp5-server)
  add_subdirectory(unit)
endif()

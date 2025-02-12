# Changelog

This project tries to adhere to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0]

### Added

- Initial release of the "Butterfile Collector" extension.
- Explorer view "File Collections" to manage file collections.
- Command "New Collection" to create a new file collection.
- Command "Refresh Collections" to update the file collections view.
- Command "Open All Files" that opens all files within a collection.
- Command "Add Files to Collection" for manual addition of files.
- Command "Add Active File to Collection" for quick addition of the current file.
- Command "Add to Collection" integrated in the Explorer context menu.
- Command "Copy Paths" to copy file paths with customizable separators.
- Command "Remove File" to remove a file from a collection.
- Configuration settings:
  - "fileCollections.pathSeparator": set the character(s) used to separate paths when copying.
  - "fileCollections.copyRelativePath": option to copy relative paths (defaulting to the workspace root).

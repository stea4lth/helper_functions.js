
/**
 * Recursively copies one directory to another.
 *
 * If not $to_dir exists, the directory is created. Hidden directories and files are
 * not included by default.
 * 
 * @param string $from_dir	Source directory to copy.
 * @param string $to_dir	Target directory.
 * @param bool $hidden		TRUE if hidden files and directories should be copied. Defaults
 *							to FALSE.
 * @param int $mode			Attributes of the target files and directories. Defaults to
 *							0755.
 */
function copy_dir ($from_dir, $to_dir, $hidden = false, $mode = 0755) {
	if (!file_exists($from_dir)) return;
		// Add '/' at the end of paths if missing
	if (substr($from_dir, -1) != '/') $from_dir .= '/';
	if (substr($to_dir, -1) != '/') $to_dir .= '/';

	if (!file_exists($to_dir)) {
			// Create target directory
		mkdir($to_dir);
		chmod($to_dir, $mode);	// disabled - don't need to mess with permissions
	}

	if ($dir = opendir($from_dir)) {
		while (($fname = readdir($dir)) !== false) {
				// Skip *nix . and .. files
			if ($fname == '.' || $fname == '..') continue;

			if (!$hidden && substr($fname, 0, 1) != '.') {
				$from = $from_dir . $fname;
				$to = $to_dir . $fname;

				if (is_dir($from)) {
						// Recursively copy the inner directory
					copy_dir($from . '/', $to . '/');
				}
				else {
						// Current file is a file, copy
					copy($from, $to);
					chmod($to, $mode);	// disabled - don't need to mess with permissions
				}
			}
		}
		closedir($dir);
	}
}


/**
 * [remove_files_dir_contents description]
 * @param  [string] $dir     [dir location]
 * @return [bool]   $result  [return true unless failed to unlink]
 */
function remove_files_dir_contents($dir) {
	$result = true;
    $files = glob( $dir . '*', GLOB_MARK );
    foreach( $files as $file ){
        if( substr( $file, -1 ) == '/' ){
            remove_files_dir_contents( $file );
        }
        else{
        	if(!unlink( $file )){
        		$result = false;
        	}
        }
    }
    // don't remove the actual dir - just all of it's contents recursively
    //rmdir( $dir ); // uncomment this to remove $dir too
    return $result;
}

<?php
/**
 * Given a filename or filepath, this will return the extension.
 */
function get_file_ext($file) {
   return strtolower(substr($file, strrpos($file, '.') + 1));
}

/**
 * Given a filename or filepath, this will return the base filename.
 */
function filename($file) {
   return basename($file, "." . get_file_ext($file));
}

/**
 * Recursively get's all the files given a path.
 *
 * @param - The full path to the directory you would like to retrieve the files from.
 * @param - An array of extensions to only include in your search.  Empty array means all files.
 * @param - If you would like to search recursively.
 * @param - If you would like your results flattened into a single array of files.
 *          Otherwise, it will return them as a multi-array that represets the folder structure.
 */
function get_files($path, $extensions = array(), $recursive = true, $flatten = true) {
   $files = array();
   if(is_dir($path)) {
      if($contents = opendir($path)) {
         while(($node = readdir($contents)) !== false) {
            if($node!="." && $node!="..") {
               $directory = is_dir($path."/".$node);
               if($recursive && $directory) {
                  if( $flatten ) {
                     $files = array_merge($files, get_files($path.'/'.$node, $extensions, $recursive, $flatten));
                  }
                  else {
                     $files[] = get_files($path.'/'.$node, $extensions, $recursive, $flatten);
                  }
               }
               else if (!$directory){
                  if(count($extensions) > 0) {
                     if(in_array(get_file_ext($node), $extensions)) {
                        $files[] = $path.'/'.$node;
                     }
                  }
                  else {
                     $files[] = $path.'/'.$node;
                  } 
               }
            }
         }
      }
   }
   return $files;
}
  
// Copy's a file, but makes sure the directory is created.
function smart_copy( $src, $dest, $chmod=0755 ) {
   $directory = dirname($dest); 
   if (!is_dir($directory)){ 
      if (!mkdir($directory, $chmod, true)){ 
         return FALSE; 
      } 
   } 
   if( $src && $dest ) {
		copy( $src, $dest );
   }
} 

// Opens a new file, but makes sure the directory is created.
function smart_fopen($path, $mode, $chmod=0755) { 
   $directory = dirname($path);   
   if (!is_dir($directory)){ 
      if (!mkdir($directory, $chmod, true)){ 
         return FALSE; 
      } 
   }   
   return fopen($path, $mode); 
} 

/*
 *    String Encryption:  Pass in string with a password.
 */

function get_rnd_iv($iv_len)
{
   $iv = '';
   while ($iv_len-- > 0) {
       $iv .= chr(mt_rand() & 0xff);
   }
   return $iv;
}
function md5_encrypt($plain_text, $password, $iv_len = 16)
{
   $plain_text .= "\x13";
   $n = strlen($plain_text);
   if ($n % 16) $plain_text .= str_repeat("\0", 16 - ($n % 16));
   $i = 0;
   $enc_text = get_rnd_iv($iv_len);
   $iv = substr($password ^ $enc_text, 0, 512);
   while ($i < $n) {
       $block = substr($plain_text, $i, 16) ^ pack('H*', md5($iv));
       $enc_text .= $block;
       $iv = substr($block . $iv, 0, 512) ^ $password;
       $i += 16;
   }
   return base64_encode($enc_text);
}
function md5_decrypt($enc_text, $password, $iv_len = 16)
{
   $enc_text = base64_decode($enc_text);
   $n = strlen($enc_text);
   $i = $iv_len;
   $plain_text = '';
   $iv = substr($password ^ substr($enc_text, 0, $iv_len), 0, 512);
   while ($i < $n) {
       $block = substr($enc_text, $i, 16);
       $plain_text .= $block ^ pack('H*', md5($iv));
       $iv = substr($block . $iv, 0, 512) ^ $password;
       $i += 16;
   }
   return preg_replace('/\\x13\\x00*$/', '', $plain_text);
}

/*
 *    End Encryption routines.
 */

// This function will extract a string given a start and end tag.
function ExtractString($str, $start, $end) {
   $str_low = strtolower($str);
   $pos_start = strpos($str_low, $start);
   $pos_end = strpos($str_low, $end, ($pos_start + strlen($start)));
   if ( ($pos_start !== false) && ($pos_end !== false) )
   {
      $pos1 = $pos_start + strlen($start);
      $pos2 = $pos_end - $pos1;
      return substr($str, $pos1, $pos2);
   }   
}

/*  A function that detects SRC, HREF and URL links, in addition to URLs in CSS code, and Javascript imports. 
 *  It also understands html entities(such as &amp;) inside URLs.
 *    $matches[3] will contain Javascript import links, 
 *    $matches[5] will contain the CSS links
 *    $matches[8] will contain the regular URL/SRC/HREF HTML links. 
 */

function get_links($url) {
   if( !($body = @file_get_contents($url)) ) return FALSE;
   //Pattern building across multiple lines to avoid page distortion.
   $pattern  = "/((@import\s+[\"'`]([\w:?=@&\/#._;-]+)[\"'`];)|";
   $pattern .= "(:\s*url\s*\([\s\"'`]*([\w:?=@&\/#._;-]+)";
   $pattern .= "([\s\"'`]*\))|<[^>]*\s+(src|href|url)\=[\s\"'`]*";
   $pattern .= "([\w:?=@&\/#._;-]+)[\s\"'`]*[^>]*>))/i";
   //End pattern building.
   preg_match_all ($pattern, $body, $matches);
   return (is_array($matches)) ? $matches : FALSE;
}


// Validate an email
function validate_email($email){
   $qtext = '[^\\x0d\\x22\\x5c\\x80-\\xff]';
   $dtext = '[^\\x0d\\x5b-\\x5d\\x80-\\xff]';
   $atom = '[^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+';
   $quoted_pair = '\\x5c\\x00-\\x7f';
   $domain_literal = "\\x5b($dtext|$quoted_pair)*\\x5d";
   $quoted_string = "\\x22($qtext|$quoted_pair)*\\x22";
   $domain_ref = $atom;
   $sub_domain = "($domain_ref|$domain_literal)";
   $word = "($atom|$quoted_string)";
   $domain = "$sub_domain(\\x2e$sub_domain)*";
   $local_part = "$word(\\x2e$word)*";
   $addr_spec = "$local_part\\x40$domain";
   return preg_match("!^$addr_spec$!", $email);
}

/*
 *  Given two arrays, one regular, the other jumbled... the function will determine if the two arrays
 *  have the same letters (no repeats).
 */
function array_numbers(&$item) { $item = ord($item); }
function same_characters($array, $jumbled) {
   $temp1 = array_values($array);
   $temp2 = array_values($jumbled);
   array_walk($temp1, 'array_numbers');
   array_walk($temp2, 'array_numbers');
   return (array_product($temp2) == array_product($temp1));
}

/**  
 * Regular expression version of the strpos function.  Will also change the Pattern variable to the
 *  actual string that was matched so that we can determine the length.
 */
function preg_strpos($haystack, &$pattern, $offset = 0) {
   $matches = array();
   if(preg_match($pattern, substr($haystack, $offset), $matches, PREG_OFFSET_CAPTURE) === 1) {
      $pattern = $matches[0][0];
      return ($matches[0][1] + $offset);
   }
   else {
      return FALSE;  
   }
}

/**
 * A function that takes an array and returns it in XML format.  
 */
function array_to_xml($arr,$first=true) {
   $output = ($first) ? "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<data>\n" : "";
   foreach($arr as $key => $val) { 
      $key = (is_numeric($key)) ? "arr_".$key : $key;    // <0 is not allowed
      switch (gettype($val)) { 
         case "array":
            $output .= "<".htmlspecialchars($key)." type='array' size='".count($val)."'>". array_to_xml($val,false)."</".htmlspecialchars($key).">\n"; 
            break;
         case "boolean":
            $output .= "<".htmlspecialchars($key)." type='bool'>". ($val?"true":"false"). "</".htmlspecialchars($key).">\n"; 
            break;
         case "integer":
            $output .= "<".htmlspecialchars($key)." type='integer'>". htmlspecialchars($val)."</".htmlspecialchars($key).">\n"; 
            break;
         case "double":
            $output .= "<".htmlspecialchars($key)." type='double'>". htmlspecialchars($val)."</".htmlspecialchars($key).">\n"; 
            break;
         case "string":
            $output .= "<".htmlspecialchars($key)." type='string' size='".strlen($val)."'>". htmlspecialchars($val)."</".htmlspecialchars($key).">\n"; 
            break;
         default:
            $output .= "<".htmlspecialchars($key)." type='unknown'>".gettype($val). "</".htmlspecialchars($key).">\n"; 
            break;
      }
   }
   $output .= ($first) ? "</data>\n" : "";
   return $output;
}

/**
 * A function that sorts a two diminsional array.
 */
function array_sort($array, $key) {
  for ($i = 0; $i < sizeof($array); $i++) {
       $sort_values[$i] = $array[$i][$key];
  } 
  asort ($sort_values);
  reset ($sort_values);
  while (list ($arr_key, $arr_val) = each ($sort_values)) {
         $sorted_arr[] = $array[$arr_key];
  }
  return $sorted_arr;
}
?>

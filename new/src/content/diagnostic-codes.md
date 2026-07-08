---
title: Diagnostic Error Codes
description: fish-lsp diagnostic error codes reference table
slug: diagnostic-codes
order: 10
section: Reference
---
<!-- import CodeTabs from '@components/CodeTabs.astro'; -->

# Diagnostic Error Codes
The `fish-lsp` provides numerous diagnostics which are displayed in your editor with a specific error code, and a description of the error.

The error codes are used to identify specific diagnostics and can be used to disable/enable specific diagnostics in your fish scripts.

![](/comment.png)

> [!Important]
> This page provides a reference table for all the diagnostic error codes that `fish-lsp` can produce.

## Error Code Table

| Error Code | Description                                                | Example                                                                                                         | Fix                                                                                     |
| ---------- | ---------------------------------------------------------- | -----------------------------------------------------------------------------------------                       | --------------------------------------------------------------------------------------- |
| 1001       | Missing closing token                                      | `echo "` <br> `echo '` <br/> `begin` <br/> `function foo` <br/> `echo (`                                        | `echo "";` <br> `echo '';` <br/> `begin; end` <br/> `function foo; end` <br/> `echo ()` |
| 1002       | Extra closing token                                        | `function; end; end;` <br> `if; end; end;`                                                                      | `function; end;` <br> `if; end;`                                                        |
| 1003       | Invalid array index                                        | `$PATH[0]`                                                                                                      | `$PATH[1]`                                                                              |
| 1004       | Source filename does not exist                             | `source ./non-existent-file.fish`                                                                               | `source ./existing-file.fish`                                                           |
| 1005       | Sourcing filename with `.` syntax                          | `. ./file.fish`                                                                                                 | `source ./file.fish`                                                                    |
| 2001       | Non-escaped expansion variable in single quote string      | `echo '$HOME'`                                                                                                  | `echo "$HOME"`                                                                          |
| 2002       | alias used, prefer using functions instead                 | `alias ls='ls -G'`                                                                                              | `function ls; ls -G $argv; end`                                                         |
| 2003       | Universal scope set in non-interactive session             | `set -Ux persistent_var`                                                                                        | `set -gx persistent_var`                                                                |
| 2004       | External shell command used when equivalent fish builtin exists | `cat file.txt`                                                                                             | `command cat file.txt` or use the fish builtin equivalent                               |
| 3001       | test command string check, should be wrapped as a string   | `test $str1 = $str2`                                                                                            | `test "$str1" = "$str2"`                                                                |
| 3002       | Conditional command should include a silence option        | `if set some_var; end;`                                                                                         | `if set -q some_var; end;`                                                              |
| 3003       | Dereference variable definition could be undefined         | `set $some_var value`                                                                                           | `if set -q some_var \|\| test -n "$some_var"; set $some_var value; end`                   |
| 4001       | Autoloaded function missing definition                     | in a autoloaded function at:<br/> __fish/functions/file.fish__<br/><hr/>`# empty`                                    | in a autoloaded function at:<br/> __fish/functions/file.fish__<br/><hr/>`function file; end;`|
| 4002       | Autoloaded function does not match filename                | in a autoloaded function at:<br/> __fish/functions/file.fish__<br/><hr/>`function __file;end;`                       | in a autoloaded function at: __fish/functions/file.fish__<br/><hr/>`function file; end;`     |
| 4003       | Function name using reserved keyword                       | `function continue`<br/>`end`                                                                                   | `function _continue`<br/>`end`                                                          |
| 4004       | Unused local function                                      | in a autoloaded function at:<br/> __fish/functions/foo.fish__<br/><hr/>`function foo;end;`<br/> `function bar; end;` | in a autoloaded function at:<br/> __fish/functions/foo.fish__<br/> <hr/>`function foo`<br/>`    bar`<br/>`end`<br/>`function bar; end` |
| 4005       | autoloaded completion missing command name                 | when a file like: <br/> __fish/completions/foo.fish__<br/><hr/>`complete -c nofoo -f`                           | when a file like: <br/> __fish/completions/foo.fish__<br/><hr/>`complete -c foo -f`     |
| 4006       | duplicate function name in same scope                      | `function a; end;` <br/> `function a; end` <br/> `alias a="command a"`                                          | `function a; end;` <br/> `function b; end` <br/> `alias c="command a"` <br/>            |
| 4007       | Autoloaded event hook function missing usage               | `function foo --on-event some_event; end;` <br/>                                                                | `function foo --on-event some_event; end;` <br/> `emit some_event` <br/>                |
| 4008       | Autoloaded function requires a description                 | `function foo; end;`                                                                                            | `function foo -d "description"; end;`                                                   |
| 5001       | Argparse missing end of stdin                              | `argparse h/help`                                                                                               | `argparse h/help -- $argv`                                                              |
| 5555       | Unreachable code                                           | `echo "$status"; and return 0; or return 1;` <br/> `echo $status # unreachable`                                 | `echo "$status"` <br/> `echo $status # reachable`                                       |
| 6001       | fish-lsp deprecated env variable                           | `set -gx fish_lsp_logfile`                                                                                      | `set -gx fish_lsp_log_file`                                                             |
| 7001       | Unknown command                                            | `nonexistent_command`                                                                                           | Use a valid command or define the function                                              |
| 8001       | fish-lsp invalid diagnostic code                           | `# @fish-lsp-disable 100111`                                                                                    | `# @fish-lsp-disable 1001`                                                              |
| 9999       | use `fish --no-execute` to check for syntax errors         | **N/A**                                                                                                         | **N/A**                                                                                 |


## Using comments to disable diagnostics per file

You can disable/enable diagnostics from the language server by adding comments to
line(s)/line-ranges in your scripts.

There are __4 different ways__ to change the diagnostics behavior's via comments:

```fish
# @fish-lsp-disable
# @fish-lsp-disable-next-line
# @fish-lsp-enable
# @fish-lsp-enable-next-line
```

Without specifying which diagnostics to disable/enable, the comments will by default disable/enable all diagnostics until the end of the file, or next disable/enable directive.

To specify disabling only specific diagnostics, you can add the error codes to the comments:

```fish
# @fish-lsp-enable 1001 1002 1003 1004 2001 2002 2003 2004 3001 3002 4001 4002 4003 4004 4008 5001 7001
echo 'enables diagnostics even if they were previously disabled'

# @fish-lsp-disable 1001 1002 1003 1004 2001 2002 2003 2004 3001 3002 4001 4002 4003 4004 4008 5001 7001
echo 'disables diagnostics even if they were previously enabled'
```

The following example shows how to use these comments in your fish scripts:

```fish
# @fish-lsp-enable
echo 'enables all previously disabled diagnostics'

# @fish-lsp-disable-next-line 2001 2002
alias l='ls $PWD' # no warnings for alias usage or non-escaped expansion variables
alias l='ls $PWD' # warnings 2001, 2002 will be shown

## diagnostics can be disabled for a range of lines
# @fish-lsp-disable 2002
alias ls  'exa --color=always --icons -1'
alias lsd 'exa --color=always --icons'
alias lst 'exa --color=always --icons --tree'
# @fish-lsp-enable 2002
### only diagnostic 2002 will be disabled in the range of lines above,
### other diagnostics wont be affected

# @fish-lsp-disable
echo 'all diagnostics will be disabled till EOF unless otherwise enabled'
# @fish-lsp-enable-next-line 2002
alias ls_problem 'exa --color=always --icons -1' # diagnostic 2002 will be enabled

echo 'all diagnostics will be disabled again'
```

> [!TIP]
> Try this out directly in the [playground!](https://playground.fish-lsp.dev/?preview=IyBAZmlzaC1sc3AtZW5hYmxlCmVjaG8gJ2VuYWJsZXMgYWxsIHByZXZpb3VzbHkgZGlzYWJsZWQgZGlhZ25vc3RpY3MnCgojIEBmaXNoLWxzcC1kaXNhYmxlLW5leHQtbGluZSAyMDAxIDIwMDIKYWxpYXMgbD0nbHMgJFBXRCcgIyBubyB3YXJuaW5ncyBmb3IgYWxpYXMgdXNhZ2Ugb3Igbm9uLWVzY2FwZWQgZXhwYW5zaW9uIHZhcmlhYmxlcwphbGlhcyBsPSdscyAkUFdEJyAjIHdhcm5pbmdzIDIwMDEsIDIwMDIgd2lsbCBiZSBzaG93bgoKIyMgZGlhZ25vc3RpY3MgY2FuIGJlIGRpc2FibGVkIGZvciBhIHJhbmdlIG9mIGxpbmVzCiMgQGZpc2gtbHNwLWRpc2FibGUgMjAwMgphbGlhcyBscyAgJ2V4YSAtLWNvbG9yPWFsd2F5cyAtLWljb25zIC0xJw%3D%3D&uri=file%3A%2F%2F%2Fworkspace%2Fexample.fish#code=IyBAZmlzaC1sc3AtZW5hYmxlCmVjaG8gJ2VuYWJsZXMgYWxsIHByZXZpb3VzbHkgZGlzYWJsZWQgZGlhZ25vc3RpY3MnCgojIEBmaXNoLWxzcC1kaXNhYmxlLW5leHQtbGluZSAyMDAxIDIwMDIKYWxpYXMgbD0nbHMgJFBXRCcgIyBubyB3YXJuaW5ncyBmb3IgYWxpYXMgdXNhZ2Ugb3Igbm9uLWVzY2FwZWQgZXhwYW5zaW9uIHZhcmlhYmxlcwphbGlhcyBsPSdscyAkUFdEJyAjIHdhcm5pbmdzIDIwMDEsIDIwMDIgd2lsbCBiZSBzaG93bgoKIyMgZGlhZ25vc3RpY3MgY2FuIGJlIGRpc2FibGVkIGZvciBhIHJhbmdlIG9mIGxpbmVzCiMgQGZpc2gtbHNwLWRpc2FibGUgMjAwMgphbGlhcyBscyAgJ2V4YSAtLWNvbG9yPWFsd2F5cyAtLWljb25zIC0xJwphbGlhcyBsc2QgJ2V4YSAtLWNvbG9yPWFsd2F5cyAtLWljb25zJwphbGlhcyBsc3QgJ2V4YSAtLWNvbG9yPWFsd2F5cyAtLWljb25zIC0tdHJlZScKIyBAZmlzaC1sc3AtZW5hYmxlIDIwMDIKIyMjIG9ubHkgZGlhZ25vc3RpYyAyMDAyIHdpbGwgYmUgZGlzYWJsZWQgaW4gdGhlIHJhbmdlIG9mIGxpbmVzIGFib3ZlLAojIyMgb3RoZXIgZGlhZ25vc3RpY3Mgd29udCBiZSBhZmZlY3RlZAoKIyBAZmlzaC1sc3AtZGlzYWJsZQplY2hvICdhbGwgZGlhZ25vc3RpY3Mgd2lsbCBiZSBkaXNhYmxlZCB0aWxsIEVPRiB1bmxlc3Mgb3RoZXJ3aXNlIGVuYWJsZWQnCiMgQGZpc2gtbHNwLWVuYWJsZS1uZXh0LWxpbmUgMjAwMgphbGlhcyBsc19wcm9ibGVtICdleGEgLS1jb2xvcj1hbHdheXMgLS1pY29ucyAtMScgIyBkaWFnbm9zdGljIDIwMDIgd2lsbCBiZSBlbmFibGVkCgplY2hvICdhbGwgZGlhZ25vc3RpY3Mgd2lsbCBiZSBkaXNhYmxlZCBhZ2Fpbic%3D&uri=file%3A%2F%2F%2Fworkspace%2Fexample.fish)

> [!NOTE]
> The `fish-lsp` will provide __code-actions__, __quickfixes__ and __completions__ for using these comments in your fish scripts.


## Using the fish_lsp_diagnostic_disable_error_codes env variable

By default all error codes are enabled. Any specific diagnostic can be disabled by appending their number to the `fish_lsp_diagnostic_disable_error_codes` environment variable.

For example to disable error codes __1001__ and __1002__ you can set the environment variable as follows:

```fish
set -gx fish_lsp_diagnostic_disable_error_codes 1001 1002
```

If you want to __ALWAYS__ disable these diagnostics, you can add them to your `config.fish` file:

```fish
# ~/.config/fish/config.fish

set -gx fish_lsp_diagnostic_disable_error_codes 1001 1002
```

## Temporarily disabling diagnostics

You could also disable diagnostics temporarily by setting the environment variable in your current shell session:

```fish
# run this in your interactive shell prompt
begin
    set -lx fish_lsp_diagnostic_disable_error_codes 2001 2002 2003 
    $EDITOR ~/.config/fish/config.fish
end
```

The previous example will open your `config.fish` file with diagnostics __2001__, __2002__, and __2003__ disabled. Once you close the editor, any previous diagnostic settings will be restored.

> [!NOTE]
> See the fish-shell's documentation on [variable scopes](https://fishshell.com/docs/current/language.html#variables-scope) for more information.

## Disabling Diagnostics for edit_command_buffer

The fish function `edit_command_buffer` is used to edit the current command buffer in the editor. This function is used by the fish shell to edit the current command buffer when you press `alt + e` in the fish shell. 

You can check what key is binded to this function by running the following command in your fish shell interactive session:

```fish
bind | string match -e 'edit_command_buffer'
# YOUR OUTPUT SHOULD LOOK SOMETHING LIKE:
#    bind --preset alt-v edit_command_buffer
#    bind --preset alt-e edit_command_buffer
```

If you wanted to disable diagnostics only while using the `fish-lsp` is editing a command buffer, you can easily do this by wrapping the `edit_command_buffer` function with __locally__ __exported__ `$fish_lsp_*` variables.

The following example shows how to disable __ALL__ diagnostics for the `edit_command_buffer` function:

```fish
function edit_command_buffer_wrapper --description 'edit command buffer with custom server configurations' 
  # place any CUSTOM server configurations here                                                            
  set -lx fish_lsp_diagnostic_disable_error_codes 1001 1002 1003 1004 2001 2002 2003 3001 3002 3003        
  # set -lx fish_lsp_max_background_files 100
  # set -lx fish_lsp_all_indexed_paths ~/.config/fish
  # set -lx fish_lsp_modifiable_paths ~/.config/fish
  # set -lx fish_lsp_logfile /tmp/fish-lsp-cmdline.logs
  # you could see all the available env variables by running: 
  # `fish-lsp env --show --no-comments`

  # open the command buffer with the custom server configuration, without                                  
  # overwriting the default server settings                                                                
  edit_command_buffer                                                                                      
end                                                                                                        
```

Now you can call the `edit_command_buffer_wrapper` function instead of the `edit_command_buffer` function to open the command buffer with the custom server configurations.

```fish
bind alt-e edit_command_buffer_wrapper
```

## Disabling Alias Warnings

Since fish's `alias` command is [just a wrapper around function](https://fishshell.com/docs/current/cmds/alias.html) and it is recommended to use functions instead of aliases. Users who still prefer using aliases may want to disable diagnostic code __2002__.

> [!Warning]
> Using [comment directives](#using-comments-to-disable-diagnostics-per-file) is likely a more flexible way to disable diagnostics.

Depending on the situation, my personal preference for using aliases is as follows:

1. Write an aliases file in `~/.config/fish/conf.d/aliases.fish`

    ```fish
    $EDITOR ~/.config/fish/conf.d/aliases.fish
    ```

   > [!NOTE]
   > the `~/.config/fish/conf.d/` directory is auto-loaded before fish reads your `config.fish` file during startup, so placing your aliases in here will ensure they are loaded before your interactive shell starts.

2. Put all your existing aliases in this file, and add a function to edit the aliases file without alias warnings

    ```fish
    # ~/.config/fish/conf.d/aliases.fish
    
    # function to edit the aliases file without alias warnings
    # short for 'alias edit'
    function aliased --description 'edit conf.d/aliases.fish'
        # when executing `aliased`, the file will be opened without alias warnings
        set -lx fish_lsp_diagnostic_disable_error_codes 2001 2002
        $EDITOR ~/.config/fish/conf.d/aliases.fish
    
        fish --no-execute ~/.config/fish/conf.d/aliases.fish
        and source ~/.config/fish/conf.d/aliases.fish
    
        if test $status -eq 0 
            set_color blue --bold && echo -n 'SUCCESS: ' && set_color normal
            echo "~/.config/fish/conf.d/aliases.fish sourced"
        else
            set_color red --bold && echo -n 'ERROR: ' && set_color normal
            echo "~/.config/fish/conf.d/aliases.fish not sourced"
        end
    end
    
    # enter your aliases here
    alias sf='source ~/.config/fish/config.fish'
    alias ls='exa -1 --color=auto --icons'
    alias lsd='exa --color=always --icons' 
    alias nvimf='$EDITOR ~/.config/fish/config.fish'
    alias nvimn='$EDITOR ~/.config/nvim/init.lua'
    alias rdme='$EDITOR README.md'
    # ...
    ```

3. Source your fish configuration file and the `conf.d/aliases.fish` file

   ```fish
   source ~/.config/fish/conf.d/aliases.fish
   source ~/.config/fish/config.fish 
   ```

4. Now you can use aliases without warnings when executing `aliased`, but prefer using functions elsewhere in your fish workspace

   ```fish
   # in your interactive shell, execute the aliased function
   aliased
   
   # alias warnings are still shown elsewhere in your config
   $EDITOR ~/.config/fish/config.fish
   ```

<br/>

> [!NOTE]
> I also like to structure my abbreviations in a similar structure, with both:
>  - a `~/.config/fish/conf.d/abbreviations.fish` file.
>  - an `abbred` function to edit the abbreviations file.
>
> This way your abbreviations, functions, and aliases are all in separate files and can be managed independently.

<!-- <br/> -->

<!-- The two key takeaways from this example are: -->
<!-- - you can set `$fish_lsp_*` environment variables in multiple locations by using fish-shell's scoping rules, and you can use this to your advantage to disable diagnostics for specific functions or files. -->
<!-- - keeping your `~/.config/fish/config.fish` modular by using the `~/.config/fish/conf.d/` directory to group items that can be loaded independently, will help you manage your fish configuration more effectively. -->
<!---->
## Other Notes

Diagnostics errors are planned to be expanded in the future to include more specific errors and warnings.

If you have any suggestions for new error codes, please see this [discussion](https://github.com/ndonfris/fish-lsp/discussions/37).

Any help contributing to __code-actions/quick-fixes__ that the lsp could provide for these errors would be greatly appreciated.

## Relevant Source Code

The relevant source code for the diagnostics can be found [here](https://github.com/ndonfris/fish-lsp/tree/master/src/diagnostics).

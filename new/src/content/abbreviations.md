---
title: Abbreviations
description: fish-lsp `abbr` commands to simplify commonly used commands
slug: abbreviations
order: 9
section: Reference
---

# Abbreviations

## Shipped abbreviations

Using the `fish-lsp` cli in the terminal can be made more efficient by defining some of the abbreviations in your startup config.

`fish-lsp complete --abbreviations`

```fish
abbr -a fl fish-lsp
abbr -a --command fish-lsp -- h --help
abbr -a --command fish-lsp -- ha --help-all
abbr -a --command fish-lsp -- c complete
abbr -a --command fish-lsp -- i info
abbr -a --command fish-lsp -- e env 
abbr -a --command fish-lsp -- s start
abbr -a --command fish-lsp -- il info --log-file
abbr -a --command fish-lsp -- ilf info --log-file
abbr -a --command fish-lsp -- it info --time-startup
abbr -a --command fish-lsp -- its info --time-startup
abbr -a --command fish-lsp -- ic info --check-health
abbr -a --command fish-lsp -- ich info --check-health
abbr -a --command fish-lsp -- sd start --dump
abbr -a --command fish-lsp -- se start --enable
```

## More abbreviations

These abbreviations are possible alternatives from the ones listed above, but are not shipped with the default abbreviations:

```fish
abbr -a fli fish-lsp info
abbr -a flis fish-lsp info --short
abbr -a flil fish-lsp info --log-file
abbr -a flit fish-lsp info --time-startup
abbr -a flc fish-lsp complete
abbr -a flh fish-lsp --help
abbr -a flha fish-lsp --help-all
abbr -a flsd fish-lsp start --dump
abbr -a flse fish-lsp start --enable
abbr -a fle fish-lsp env
abbr -a fls fish-lsp start
abbr -a flv fish-lsp --version
abbr -a flibt fish-lsp info --build-time
```

## Other abbreviations (useful for development)

Quickly navigate/access the local `fish-lsp` binary you are building from source.

<!-- ```fish -->
<!-- # use `fl_` to quickly insert the path to the fish-lsp repository -->
<!-- abbr -a fl_ \ -->
<!--     --position anywhere \ -->
<!--     --set-cursor \ -->
<!--     -- "$(string join '/' -- (fish-lsp info --path || echo '~/repos/fish-lsp.git/master') '%')" -->
<!--                                                       #     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^ -->
<!--                                                       #     hardcoded fallback directory -->
<!---->
<!-- # cd into the most recent locally built `fish-lsp` folder -->
<!-- abbr -a cdfl --set-cursor 'cd (fish-lsp info --path)/%' -->
<!---->
<!-- # tail the log file of the language server -->
<!-- abbr -a tlfl 'tail -f (fish-lsp info --log-file)' -->
<!---->
<!-- # which fish-lsp binary is being used -->
<!-- abbr -a whfl 'which fish-lsp' -->
<!-- ``` -->
<!---->
<!-- ### Extending on these abbreviations -->
<!---->
<!-- For reusing the logic of the `fl_` abbreviation, you can define a utility function that returns the path of the `fish-lsp` repository, with a fallback to a hardcoded path if the `fish-lsp info --path` command fails. This can be useful for development when you want to quickly access the local repository you are working on, without having to worry about the `fish-lsp` binary being in a different location or not being built at all. -->
<!---->
<!-- For example: -->

```fish
function _fish_lsp_path -d "abbreviation utility function to get the path of the fish-lsp repository, with a fallback to a hardcoded path"
    fish-lsp info --path 2>/dev/null || echo '~/repos/fish-lsp.git/master'
    #                                         ^^^^^^^^^^^^^^^^^^^^^^^^^^^ 
    #                                         hardcoded fallback directory
end
# use `fl_` to quickly insert the path to the fish-lsp repository
abbr -a fl_ \
    --position anywhere \
    --set-cursor \
    --function _fish_lsp_path

function _cdfl -d 'abbreviation function to cd into the most recent locally built `fish-lsp` folder'
    echo cd (_fish_lsp_path)
end
# cd into the most recent locally built `fish-lsp` folder
abbr -a cdfl --set-cursor --function _cdfl

# tail the log file of the language server
abbr -a tlfl 'tail -f (fish-lsp info --log-file)'

# which fish-lsp binary is being used
abbr -a whfl 'which fish-lsp'
```

<!-- For example: -->
<!---->
<!-- - the `fl_` abbreviation will insert the path of the fish-lsp repository directly into the location it was typed. -->
<!---->
<!-- - `cdfl` will cd into the most recent locally built `fish-lsp` binary parent folder. -->
<!---->
<!-- - `tlfl` will tail the log file of the language server, which is very useful for diagnosing issues the server may be having. -->
<!---->
<!-- Using the provided `fl_`  abbreviation, you can quickly achieve roughly the same use case as `cdfl` by typing `cd fl_` and then pressing `Tab` to expand the abbreviation and insert the path to the repository, which you can then `cd` into. -->

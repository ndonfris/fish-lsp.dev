#!/usr/bin/env fish

if not command -q freeze
    echo "install freeze to build this project"
    echo https://github.com/charmbracelet/freeze
    return 1
end

if not command -q fish-lsp
    echo "install fish-lsp to build this project"
    echo https://github.com/ndonfris/fish-lsp
    return 1
end


function __no_examples
    for a in (fish-lsp --help | string collect | string split \n -n );
        if test "$a" = "Examples:"
            return 0
        end;
        echo $a
    end;
end;

if test -z $argv
    # freeze --config user --execute 'fish-lsp --help | grep -B99999 "^Examples:" | grep -v "^Examples:"' -l bash -t dracula --window --output ./public/help-msg.svg
    # freeze --config user --execute 'fish-lsp --help | grep -B99999 "^Examples:" | grep -v "^Examples:"' -l bash -t dracula --window --output ./public/help-msg.png
    # fish-lsp --help | grep -B99999 "^Examples:" | grep -v "^Examples:"
    freeze --execute=__no_examples
    and return 
end

for arg in $argv
    switch $arg
    case 'svg'
        freeze --config user --execute 'fish-lsp --help' -l bash -t dracula --window --output ./public/help-msg.svg
    case 'jpeg'
        freeze --config user --execute 'fish-lsp --help' -l bash -t dracula --window --output ./public/help-msg.jpeg
    case 'png'
        freeze --config user --execute 'fish-lsp --help' -l bash -t dracula --window --output ./public/help-msg.png
    end
end


echo "SUCCESS!"

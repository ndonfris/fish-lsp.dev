#!/usr/bin/env fish

# Regenerates the `public/dump-*.svg` screenshots used on /docs/debugging to
# show colored `fish-lsp info --dump-*` output. Re-run after changing the
# sample script below or after `fish-lsp` output formatting changes upstream.

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

set -l sample (mktemp --suffix .fish)
echo 'function greet --argument-names name
    set -l greeting "Hello"
    echo "$greeting, $name!"
end

greet World' > $sample

set -l freeze_opts -t dracula --window --border.color "#7152dc" --border.width 0.8

# --dump-symbol-tree's icons are nerdfont glyphs (private-use codepoints), so
# the font must be embedded directly in the SVG via --font.file — otherwise
# the icons only render for visitors who happen to have a nerd font installed
# system-wide, and show as tofu boxes for everyone else.
set -l nerd_font ~/.local/share/fonts/CascadiaCode/CaskaydiaCoveNerdFontMono-Regular.ttf

freeze --execute "fish-lsp info --dump-parse-tree $sample" $freeze_opts --output public/dump-parse-tree.svg
and freeze --execute "fish-lsp info --dump-symbol-tree $sample" $freeze_opts --font.file $nerd_font --output public/dump-symbol-tree.svg
and freeze --execute "fish-lsp info --dump-semantic-tokens $sample" $freeze_opts --output public/dump-semantic-tokens.svg

command rm $sample

echo "SUCCESS!"

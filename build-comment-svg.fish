#!/usr/bin/env fish

# open a tmux pane of the native-nvim-packer
# and capture the pane

tmux capture-pane -pet 1 | freeze --window -b '#24283b' -o public/comment.svg --border.color "#7152dc" --border.width 0.4 -c user --font.file ~/.local/share/fonts/CascadiaCode/CaskaydiaCoveNerdFontMono-Regular.ttf --border.radius 7 -p 5,15

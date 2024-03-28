

# 
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

freeze --config user --execute 'fish-lsp --help' -l bash -t dracula --window --output ./public/help-msg.svg
echo "SUCCESS!"

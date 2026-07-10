#!/usr/bin/env fish
#
# fish-lsp installer — downloads the prebuilt standalone binary from the latest
# GitHub release into your local bin directory.
#
#   curl -fsSL https://fish-lsp.dev/install.fish | fish
#
# Override the install location with $fish_lsp_install_dir (default ~/.local/bin).

function _fishlsp_err
    set_color red; echo "fish-lsp install: $argv" >&2; set_color normal
end
function _fishlsp_ok
    set_color green; echo "✓ $argv"; set_color normal
end

set -l repo  'ndonfris/fish-lsp'
set -l asset 'fish-lsp.standalone'
set -l url   "https://github.com/$repo/releases/latest/download/$asset"

# ── install directory ─────────────────────────────────────────────────
set -l bindir "$HOME/.local/bin"
if set -q fish_lsp_install_dir; and test -n "$fish_lsp_install_dir"
    set bindir $fish_lsp_install_dir
end
set -l target "$bindir/fish-lsp"

# ── prerequisites ─────────────────────────────────────────────────────
if not type -q curl
    _fishlsp_err "curl is required but was not found on your \$PATH."
    exit 1
end

# ── download ──────────────────────────────────────────────────────────
echo "Downloading $asset → $target"
mkdir -p $bindir
if not curl -fL --progress-bar "$url" -o "$target"
    _fishlsp_err "download failed ($url)."
    _fishlsp_err "The standalone asset may not be published for the latest release yet."
    _fishlsp_err "Try another install method: https://fish-lsp.dev/docs/installation"
    rm -f "$target"
    exit 1
end
chmod +x "$target"
_fishlsp_ok "installed to $target"

# ── PATH ──────────────────────────────────────────────────────────────
if not contains $bindir $PATH
    fish_add_path $bindir
    _fishlsp_ok "added $bindir to your \$PATH (via fish_add_path)"
end

# ── completions ───────────────────────────────────────────────────────
set -l compdir "$HOME/.config/fish/completions"
mkdir -p $compdir
if "$target" complete >"$compdir/fish-lsp.fish" 2>/dev/null
    _fishlsp_ok "wrote completions → $compdir/fish-lsp.fish"
end

# ── verify ────────────────────────────────────────────────────────────
if "$target" info >/dev/null 2>&1
    _fishlsp_ok "fish-lsp is ready — run 'fish-lsp info' to confirm"
else
    _fishlsp_err "installed, but running it failed."
    _fishlsp_err "The standalone bundle requires Node.js >= 20 on your \$PATH."
end

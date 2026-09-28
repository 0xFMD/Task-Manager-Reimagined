{
  pkgs ? import <nixpkgs> { },
}:

pkgs.mkShell {
  packages = with pkgs; [
    nodejs
  ];

  LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath (
    with pkgs;
    [
      nspr
      nss
      dbus

      libx11
      libxcomposite
      libxdamage
      libxext
      libxfixes
      libxrandr
      libxcb

      gtk3
      atk
      at-spi2-atk
      cups

      libdrm
      libgbm
      libglvnd
      libxkbcommon

      pango
      cairo
      expat
      alsa-lib
    ]
  );
}

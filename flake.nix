{
  description = "Projeto final da disciplina PCS3623 - Banco de Dados I";

  inputs.nixpkgs.url = "https://flakehub.com/f/NixOS/nixpkgs/0.1.*.tar.gz";

  outputs = {
    self,
    nixpkgs,
  }: let
    supportedSystems = ["x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin"];
    forEachSupportedSystem = f:
      nixpkgs.lib.genAttrs supportedSystems (system:
        f {
          pkgs = import nixpkgs {inherit system;};
        });
  in {
    devShells = forEachSupportedSystem ({pkgs}: {
      default = pkgs.mkShell {
        venvDir = ".venv";
        packages = with pkgs;
          [
            python311
            pyright
            typescript-language-server
            nodejs_23
            httpie
            sqlite
          ]
          ++ (with pkgs.python311Packages; [
            pip
            venvShellHook
          ])
          ++ (with pkgs.python313Packages; [
            fastapi
            fastapi-cli
            sqlmodel
          ]);
      };
    });
  };
}

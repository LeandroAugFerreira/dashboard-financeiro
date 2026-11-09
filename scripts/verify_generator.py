"""Reprodução do gerador em pasta isolada; nunca altera as bases versionadas.

Sem rede, bibliotecas externas ou leitura de arquivos pessoais.
"""
from hashlib import sha256
from pathlib import Path
from tempfile import TemporaryDirectory
import shutil
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
ARTIFACTS = ["web/data.json", "dados/movimentacoes.csv", "dados/orcamento.csv"]


def digest(path: Path):
    return sha256(path.read_bytes()).hexdigest()


def main():
    with TemporaryDirectory(prefix="financeiro-recruiting-") as tmp:
        isolated = Path(tmp)
        shutil.copyfile(ROOT / "generate_data.py", isolated / "generate_data.py")
        (isolated / "web").mkdir()
        subprocess.run(
            [sys.executable, str(isolated / "generate_data.py")],
            cwd=isolated,
            check=True,
            timeout=30,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.PIPE,
        )
        for relative in ARTIFACTS:
            original = ROOT / relative
            regenerated = isolated / relative
            assert regenerated.is_file(), f"Artefato de teste não gerado: {relative}"
            assert digest(original) == digest(regenerated), (
                f"Divergência de reprodução: {relative}; revisar fonte antes de atualizar."
            )
        for file in ("movimentacoes.csv", "orcamento.csv"):
            public = ROOT / "web" / "dados" / file
            canonical = ROOT / "dados" / file
            assert digest(public) == digest(canonical), (
                f"CSV distribuído divergiu da fonte versionada: {file}"
            )
        print("PASS: geração Python determinística reproduz JSON e ambos CSV em diretório descartável.")
        print("PASS: downloads CSV no site correspondem aos CSV originais do repositório.")
        print("Nenhuma base de produção, arquivo pessoal ou fonte original foi alterada.")


if __name__ == "__main__":
    main()

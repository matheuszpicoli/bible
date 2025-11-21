from generators import *
from typing import Callable

import os

if __name__ == "__main__":
    MESSAGES: dict[str, str] = {
        "exit": "Você escolheu sair.",
        "invalid": "Opção inválida. Tente novamente."
    }
    
    clear_terminal: Callable[[], int] = lambda: os.system("cls" if os.name == "nt" else "clear")
    clear_terminal.__doc__ = """Executa o comando de limpar o terminal de acordo com o sistema operacional (OS - Operational System), \"cls\" para Windows (nt) e \"clear\" para Linux, MacOS e outros (posix)."""
    
    while True:
        CHOICE: int = int(input("\nGerar JSON:\n\n(0) Cancelar\n\n(1) Bíblia\n(2) Harpa Cristã\n> "))

        try:
            match CHOICE:
                case 0:
                    print(MESSAGES["exit"])
                    break
                
                case 1:
                    Bible().create_bible_JSON()
                    
                case 2:
                    ChristianHarp().create_hymns_json()
                    
                case _:
                    clear_terminal()
                    
                    print(MESSAGES["invalid"])
                    continue
            
            if input("\nDeseja fazer outra operação (S/n)?\n> ").lower() == "s":
                clear_terminal()
                continue
            
            print(MESSAGES["exit"])
            break
        
        except Exception as error:
            print(f"[{type(error).__name__}] Erro na escolha {CHOICE}: {error}")
            
            raise error

from typing import Optional

def get_string_input(prompt: str, default: Optional[str] = None) -> str:
    """
    Gets string input from the user.
    If a default is provided, it's displayed and returned if the user enters nothing.
    """
    if default is not None:
        return input(f"{prompt} (default: {default}): ") or default
    return input(f"{prompt}: ")

def get_int_input(prompt: str) -> Optional[int]:
    """
    Gets integer input from the user.
    Returns None if input is not a valid integer.
    """
    while True:
        user_input = input(f"{prompt}: ")
        if user_input.strip() == "":
            return None
        try:
            return int(user_input)
        except ValueError:
            print_error("Invalid input. Please enter a number.")

def print_message(message: str):
    """Prints a general message to the console."""
    print(message)

def print_error(message: str):
    """Prints an error message to the console."""
    print(f"ERROR: {message}")

def print_header(title: str):
    """Prints a formatted header to the console."""
    print(f"\n--- {title} ---")

def print_menu(options: dict):
    """Prints a menu of options."""
    print_header("Menu")
    for key, value in options.items():
        print(f"{key}. {value}")
    print("--------------------")

def get_menu_choice(options: dict) -> str:
    """Gets a valid menu choice from the user."""
    while True:
        choice = get_string_input("Enter your choice").strip().upper()
        if choice in options:
            return choice
        print_error("Invalid choice. Please select from the menu options.")

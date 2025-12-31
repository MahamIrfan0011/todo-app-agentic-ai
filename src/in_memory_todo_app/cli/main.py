from in_memory_todo_app.services.task_manager import TaskManager
from in_memory_todo_app.cli.utils import get_string_input, get_int_input, print_message, print_error, print_header, print_menu, get_menu_choice

def main():
    task_manager = TaskManager()
    
    menu_options = {
        "1": "Add Task",
        "2": "View Tasks",
        "3": "Update Task",
        "4": "Delete Task",
        "5": "Mark Task Complete",
        "6": "Mark Task Incomplete",
        "0": "Exit"
    }

    while True:
        print_menu(menu_options)
        choice = get_menu_choice(menu_options)

        if choice == "1":
            print_header("Add New Task")
            title = get_string_input("Enter task title", default="").strip()
            if not title:
                print_error("Task title cannot be empty.")
                continue
            description = get_string_input("Enter task description (optional)", default="").strip()
            try:
                task = task_manager.add_task(title, description)
                print_message(f"Task '{task.title}' (ID: {task.id}) added successfully.")
            except ValueError as e:
                print_error(str(e))
        
        elif choice == "2":
            print_header("View All Tasks")
            tasks = task_manager.list_tasks()
            if not tasks:
                print_message("No tasks found.")
            else:
                for task in tasks:
                    status = "✓" if task.completed else " "
                    print_message(f"[{status}] ID: {task.id} | Title: {task.title} | Description: {task.description} | Created: {task.created_at.strftime('%Y-%m-%d %H:%M:%S')}")
        
        elif choice == "3":
            print_header("Update Task")
            task_id = get_int_input("Enter task ID to update")
            if task_id is None:
                print_error("Invalid Task ID.")
                continue
            
            task = task_manager.get_task_by_id(task_id)
            if not task:
                print_error(f"Task with ID {task_id} not found.")
                continue

            print_message(f"Current Task: ID: {task.id} | Title: {task.title} | Description: {task.description} | Completed: {task.completed}")
            
            new_title = get_string_input(f"Enter new title (leave empty to keep '{task.title}')", default=task.title).strip()
            new_description = get_string_input(f"Enter new description (leave empty to keep '{task.description}')", default=task.description).strip()
            
            try:
                updated_task = task_manager.update_task(task_id, new_title, new_description)
                if updated_task:
                    print_message(f"Task ID {task_id} updated successfully.")
                else:
                    print_error(f"Failed to update task ID {task_id}.")
            except ValueError as e:
                print_error(str(e))
        
        elif choice == "4":
            print_header("Delete Task")
            task_id = get_int_input("Enter task ID to delete")
            if task_id is None:
                print_error("Invalid Task ID.")
                continue
            
            if task_manager.delete_task(task_id):
                print_message(f"Task ID {task_id} deleted successfully.")
            else:
                print_error(f"Task with ID {task_id} not found.")
        
        elif choice == "5":
            print_header("Mark Task Complete")
            task_id = get_int_input("Enter task ID to mark complete")
            if task_id is None:
                print_error("Invalid Task ID.")
                continue
            
            if task_manager.mark_task_complete(task_id):
                print_message(f"Task ID {task_id} marked complete.")
            else:
                print_error(f"Task with ID {task_id} not found.")
        
        elif choice == "6":
            print_header("Mark Task Incomplete")
            task_id = get_int_input("Enter task ID to mark incomplete")
            if task_id is None:
                print_error("Invalid Task ID.")
                continue
            
            if task_manager.mark_task_incomplete(task_id):
                print_message(f"Task ID {task_id} marked incomplete.")
            else:
                print_error(f"Task with ID {task_id} not found.")
        
        elif choice == "0":
            print_message("Exiting Todo Application. Goodbye!")
            break
        
        else:
            print_error("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()
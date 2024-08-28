import subprocess
import time
import pygame

sound_file = "music.mp3"
previous_state = False

def check_printer_queue():
    result = subprocess.run(["lpstat", "-o"], stdout=subprocess.PIPE)
    output = result.stdout.decode()
    return bool(output.strip())

def monitor_printer():
    global previous_state
    pygame.mixer.init()

    while True:
        current_state = check_printer_queue()

        if current_state and not previous_state:
            print("Printing started!")
            pygame.mixer.music.load(sound_file)
            pygame.mixer.music.play(-1) 

        elif not current_state and previous_state:
            if pygame.mixer.music.get_busy():
                print("Printing stopped!")
                pygame.mixer.music.stop()

        previous_state = current_state
        time.sleep(1)

if __name__ == "__main__":
    monitor_printer()

import os
import tkinter as tk
from tkinter import messagebox
import sqlite3
import re
import webbrowser
from PIL import Image, ImageTk, ImageDraw
from tkcalendar import Calendar
import time
# Global variable to track session start time
session_start_time = None
# Initialize the database
def init_db():
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    cursor.execute(""" CREATE TABLE IF NOT EXISTS users ( id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL ) """)
    conn.commit()
    conn.close()
# Function to handle registration
def handle_register():
    register_window = tk.Toplevel(root)
    register_window.title("Register")
    register_window.geometry("1610x900")
    register_window.configure(bg="#8B0000") # Dark red background
    # Title for the registration window
    title_label = tk.Label( register_window, text="Register", font=title_font, bg="#8B0000", fg="white" )
    title_label.pack(pady=20)
    # Username Entry
    username_label = tk.Label( register_window, text="Username", font=guest_font, bg="#8B0000", fg="white" )
    username_label.pack(pady=5)
    username_entry = tk.Entry(register_window, font=guest_font, width=30)
    username_entry.pack(pady=5)
    # Email Entry
    email_label = tk.Label( register_window, text="Email", font=guest_font, bg="#8B0000", fg="white" )
    email_label.pack(pady=5)
    email_entry = tk.Entry(register_window, font=guest_font, width=30)
    email_entry.pack(pady=5)
    # Password Entry
    password_label = tk.Label( register_window, text="Password", font=guest_font, bg="#8B0000", fg="white" )
    password_label.pack(pady=5)
    password_entry = tk.Entry(register_window, font=guest_font, width=30, show="*")
    password_entry.pack(pady=5)
    # Confirm Password Entry
    confirm_label = tk.Label( register_window, text="Confirm Password", font=guest_font, bg="#8B0000", fg="white" )
    confirm_label.pack(pady=5)
    confirm_entry = tk.Entry(register_window, font=guest_font, width=30, show="*")
    confirm_entry.pack(pady=5)
    def submit_registration():
        username = username_entry.get()
        email = email_entry.get()
        password = password_entry.get()
        confirm_password = confirm_entry.get()
        # Validate if email is a PUP email
        if not re.match(r"^[a-zA-Z0-9._%+-]+@iskolarngbayan\.pup\.edu\.ph$", email):
            messagebox.showerror("Error", "Only @iskolarngbayan.pup.edu.ph email addresses are allowed!")
            return
        if not username or not email or not password or not confirm_password:
            messagebox.showerror("Error", "All fields are required!")
            return
        if password != confirm_password:
            messagebox.showerror("Error", "Passwords do not match!")
            return
        conn = sqlite3.connect("users.db")
        cursor = conn.cursor()
        try:
            cursor.execute("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", (username, email, password))
            conn.commit()
            messagebox.showinfo("Success", "Registration successful! You can now log in.")
            register_window.withdraw()
        except sqlite3.IntegrityError:
            messagebox.showerror("Error", "Email already exists!")
        finally:
            conn.close()
    submit_button = tk.Button( register_window, text="Submit", font=button_font, bg="#ba1414", fg="#c4c2c2", command=submit_registration, cursor='hand2', activebackground='#8B0000', activeforeground='white', highlightbackground='#8B0000', highlightthickness=2, highlightcolor='white', height=1, width=8 )
    submit_button.pack(pady=20)
# Function to handle login
def handle_login():
    global session_start_time
    login_window = tk.Toplevel(root)
    login_window.title("Login")
    login_window.geometry("1610x900")
    login_window.configure(bg="#8B0000")
    root.withdraw() #Close the Main Window after function the login
    # Email Entry
    email_label = tk.Label( login_window, text="Email", font=guest_font, bg="#8B0000", fg="white" )
    email_label.pack(pady=5)
    email_entry = tk.Entry(login_window, font=guest_font, width=30)
    email_entry.pack(pady=5)
    # Password Entry
    password_label = tk.Label( login_window, text="Password", font=guest_font, bg="#8B0000", fg="white" )
    password_label.pack(pady=5)
    password_entry = tk.Entry(login_window, font=guest_font, width=30, show="*")
    password_entry.pack(pady=5)
    def submit_login():
        global session_start_time
        email = email_entry.get()
        password = password_entry.get()
        if not email or not password:
            messagebox.showerror("Error", "Email and Password are required!")
            return
        conn = sqlite3.connect("users.db")
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = ? AND password = ?", (email, password))
        user = cursor.fetchone()
        conn.close()
        if user:
            session_start_time = time.time() # Start tracking time
            messagebox.showinfo("Success", f"Welcome back, {user[1]}!")
            login_window.destroy()
            open_gender_selection()
        else:
            messagebox.showerror("Error", "Invalid Email or Password!")
    submit_button = tk.Button( login_window, text="LOGIN", font=button_font, bg="#ba1414", fg="#c4c2c2", command=submit_login, cursor='hand2', activebackground='#8B0000', activeforeground='white', highlightbackground='#8B0000', highlightthickness=2, highlightcolor='white', height=1, width=8 )
    submit_button.pack(pady=20)
# Gender Selection Window
def open_gender_selection():
    gender_window = tk.Toplevel(root)
    gender_window.title("Select Gender")
    gender_window.geometry("1610x900")
    gender_window.configure(bg="#8B0000")
    gender_label = tk.Label(gender_window, text="Select Gender", font=title_font, bg="#8B0000", fg="white")
    gender_label.pack(pady=20)
    def set_gender(gender):
        messagebox.showinfo("Gender", f"Gender selected: {gender}")
        gender_window.destroy() #Close the gender selection window
        open_bmi_section()
    male_button = tk.Button(gender_window, text="MALE", font=button_font, bg="#ba1414", fg="#c4c2c2", command=lambda: set_gender("Male"), cursor='hand2', activebackground='#8B0000', activeforeground='white', highlightbackground='#8B0000', highlightthickness=2, highlightcolor='white', height=1, width=13 )
    male_button.pack(pady=10)
    female_button = tk.Button(gender_window, text="FEMALE", font=button_font, bg="#ba1414", fg="#c4c2c2", command=lambda: set_gender("Female"), cursor='hand2', activebackground='#8B0000', activeforeground='white', highlightbackground='#8B0000', highlightthickness=2, highlightcolor='white', height=1, width=13 )
    female_button.pack(pady=10)
# BMI Section
def open_bmi_section():
    bmi_window = tk.Toplevel(root)
    bmi_window.title("BMI Calculation")
    bmi_window.geometry("1610x900")
    bmi_window.configure(bg="#8B0000")
    bmi_label = tk.Label(bmi_window, text="Enter your weight and height to calculate BMI", font=title_font, bg="#8B0000", fg="white")
    bmi_label.pack(pady=20)
    weight_label = tk.Label(bmi_window, text="Weight (kg)", font=guest_font, bg="#8B0000", fg="white")
    weight_label.pack(pady=5)
    weight_entry = tk.Entry(bmi_window, font=guest_font, width=30)
    weight_entry.pack(pady=5)
    height_label = tk.Label(bmi_window, text="Height (m)", font=guest_font, bg="#8B0000", fg="white")
    height_label.pack(pady=5)
    height_entry = tk.Entry(bmi_window, font=guest_font, width=30)
    height_entry.pack(pady=5)
    def calculate_bmi():
        try:
            weight = float(weight_entry.get())
            height = float(height_entry.get())
            if weight < 0 or height < 0:
                messagebox.showerror("Error", "Weight and height must be non- negative!")
                return
            if height == 0:
                messagebox.showerror("Error", "Height cannot be zero!")
                return
            if weight == 0:
                messagebox.showerror("Error", "Weight cannot be zero!")
                return
            bmi = weight / (height ** 2)
            messagebox.showinfo("BMI Result", f"Your BMI is: {bmi:.2f}")
            bmi_window.destroy() #Close the BMI window
            open_calendar_section()
        except ValueError:
            messagebox.showerror("Error", "Please enter valid values!")
    calculate_button = tk.Button(bmi_window, text="CALCULATE BMI", font=button_font, bg="#ba1414", fg="#c4c2c2", command=calculate_bmi, cursor='hand2', activebackground='#8B0000', activeforeground='white', highlightbackground='#8B0000', highlightthickness=2, highlightcolor='white', height=2, width=16 )
    calculate_button.pack(pady=20)
session_start_time = None # Assuming a global variable for session time tracking
def open_calendar_section():
    calendar_window = tk.Toplevel(root)
    calendar_window.title("Calendar and Settings")
    calendar_window.geometry("1610x900")
    # Left frame for calendar
    left_frame = tk.Frame(calendar_window, width=600, height=600, bg="#C0C0C0")
    left_frame.pack(side="left", fill="both", expand=True)
    # Right frame for settings
    right_frame = tk.Frame(calendar_window, width=600, height=600, bg="#8B0000") # Dark red background
    right_frame.pack(side="right", fill="both", expand=True)
    # Add Calendar to left frame
    calendar_widget = Calendar(left_frame, selectmode="day", year=2025, month=1, day=1, date_pattern='yyyy-mm-dd', font=("Arial", 16), background="#C0C0C0", foreground="white", selectbackground="#C0C0C0", selectforeground="black", weekendbackground="#03728c", weekendforeground="white", borderwidth=2, padding=5 )
    calendar_widget.pack(pady=20, padx=20, fill="both", expand=True)
    # Link each date to a URL
    date_to_url = { '2025-01-01': 'https://youtu.be/-hSma-BRzoo?si=tU-87WyAz9OFBDTs',
        '2025-01-02': 'https://youtu.be/UIPvIYsjfpo?si=zUAOmF6f2s_Y1tMG',
        '2025-01-03': 'https://youtu.be/Yu20j5jGHTc?si=7oOVfqy3gRRksMBC',
        '2025-01-04': 'https://youtu.be/0Grvq1Kz6L8?si=sRmgMW0S5XvE25Ic',
        '2025-01-05': 'https://youtu.be/M7qogNry8t4?si=M6JHAbHbZvqqHyfC',
        '2025-01-06': 'https://youtu.be/FeR-4_Opt-g?si=rDKhjosmhaV7wjpy',
        '2025-01-07': 'https://youtu.be/8aXwejFPDTw?si=qqcTnYuKkU0ZP_mp',
        '2025-01-08': 'https://youtu.be/Tz9d7By2ytQ?si=ijawAmYWG96LigyM',
        '2025-01-09': 'https://youtu.be/BdhqubW1GJE?si=uVemsGx8BIdhxkFM',
        '2025-01-10': 'https://youtu.be/uUKAYkQZXko?si=27S0Yq7t4VMCnR-S',
        '2025-01-11': 'https://youtu.be/-MRNjTr6xrE?si=dVvZ_pUuOgcs47Pe',
        '2025-01-12': 'https://youtu.be/M7qogNry8t4?si=M6JHAbHbZvqqHyfC',
        '2025-01-13': 'https://youtu.be/KeNObkhENKQ?si=LPdjTfJgWVqOIxjE',
        '2025-01-14': 'https://youtu.be/8gQbgyTlS-8?si=P5ot6zYfHUPZYPJ2',
        '2025-01-15': 'https://youtu.be/lJla0_b8spI?si=kTFO4j9clzjZU1zC',
        '2025-01-16': 'https://youtu.be/L7OWsJ97ANs?si=k84XqHvNBvrH2Tyy',
        '2025-01-17': 'https://youtu.be/N-15wUPnqpc?si=J9TUaN_sAwsrftXB',
        '2025-01-18': 'https://youtu.be/ho8fvPH_Ro0?si=NSMwLZf5_GUEdjyE',
        '2025-01-19': 'https://youtu.be/TGiFtW8zy3w?si=TcAnP2fZ4crOMNWM',
        '2025-01-20': 'https://youtu.be/h5tFiJVTQBw?si=3HXx2wuj7RE9fp7N',
        '2025-01-21': 'https://youtu.be/Q2cMMnUuKYQ?si=Pw4joB9mJ0FoWjnM',
        '2025-01-22': 'https://youtu.be/59tchbMrjIg?si=JssXGkvR3TwwLkym',
        '2025-01-23': 'https://youtu.be/kuUZYUBHryw?si=CrEq0C0sUdIEemBX',
        '2025-01-24': 'https://youtu.be/0Grvq1Kz6L8?si=jPN6t7cxXyB8wOm_',
        '2025-01-25': 'https://youtu.be/J212vz33gU4?si=ih-p8the1Qk_Z7VR',
        '2025-01-26': 'https://youtu.be/qs8_VefQvpk?si=C9wNe3Q84J2MvDKR',
        '2025-01-27': 'https://youtu.be/Dk21IuMwpec?si=Mj5vs3wPjqhi5DXY',
        '2025-01-28': 'https://youtu.be/kW0-IK5AvUY?si=g0ZPVTBt1-lFvXXi',
        '2025-01-29': 'https://youtu.be/FeR-4_Opt-g?si=tT4KUx9s-XPwBGGP',
        '2025-01-30': 'https://youtu.be/_fesO5oNcEs?si=fL7M-wkLmnBYVqrO',
        '2025-01-31': 'https://youtu.be/cbKkB3POqaY?si=lTJxZeCKWvgBPKcv',
        '2025-02-01': 'https://youtu.be/-hSma-BRzoo?si=tU-87WyAz9OFBDTs',
        '2025-02-02': 'https://youtu.be/UIPvIYsjfpo?si=zUAOmF6f2s_Y1tMG',
        '2025-02-03': 'https://youtu.be/Yu20j5jGHTc?si=7oOVfqy3gRRksMBC',
        '2025-02-04': 'https://youtu.be/0Grvq1Kz6L8?si=sRmgMW0S5XvE25Ic',
        '2025-02-05': 'https://youtu.be/M7qogNry8t4?si=M6JHAbHbZvqqHyfC',
        '2025-02-06': 'https://youtu.be/FeR-4_Opt-g?si=rDKhjosmhaV7wjpy',
        '2025-02-07': 'https://youtu.be/8aXwejFPDTw?si=qqcTnYuKkU0ZP_mp',
        '2025-02-08': 'https://youtu.be/Tz9d7By2ytQ?si=ijawAmYWG96LigyM',
        '2025-02-09': 'https://youtu.be/BdhqubW1GJE?si=uVemsGx8BIdhxkFM',
        '2025-02-10': 'https://youtu.be/uUKAYkQZXko?si=27S0Yq7t4VMCnR-S',
        '2025-02-11': 'https://youtu.be/-MRNjTr6xrE?si=dVvZ_pUuOgcs47Pe',
        '2025-02-12': 'https://youtu.be/M7qogNry8t4?si=M6JHAbHbZvqqHyfC',
        '2025-02-13': 'https://youtu.be/KeNObkhENKQ?si=LPdjTfJgWVqOIxjE',
        '2025-02-14': 'https://youtu.be/8gQbgyTlS-8?si=P5ot6zYfHUPZYPJ2',
        '2025-02-15': 'https://youtu.be/lJla0_b8spI?si=kTFO4j9clzjZU1zC',
        '2025-02-16': 'https://youtu.be/L7OWsJ97ANs?si=k84XqHvNBvrH2Tyy',
        '2025-02-17': 'https://youtu.be/N-15wUPnqpc?si=J9TUaN_sAwsrftXB',
        '2025-02-18': 'https://youtu.be/ho8fvPH_Ro0?si=NSMwLZf5_GUEdjyE',
        '2025-02-19': 'https://youtu.be/TGiFtW8zy3w?si=TcAnP2fZ4crOMNWM',
        '2025-02-20': 'https://youtu.be/h5tFiJVTQBw?si=3HXx2wuj7RE9fp7N',
        '2025-02-21': 'https://youtu.be/Q2cMMnUuKYQ?si=Pw4joB9mJ0FoWjnM',
        '2025-02-22': 'https://youtu.be/59tchbMrjIg?si=JssXGkvR3TwwLkym',
        '2025-02-23': 'https://youtu.be/kuUZYUBHryw?si=CrEq0C0sUdIEemBX',
        '2025-02-24': 'https://youtu.be/0Grvq1Kz6L8?si=jPN6t7cxXyB8wOm_',
        '2025-02-25': 'https://youtu.be/J212vz33gU4?si=ih-p8the1Qk_Z7VR',
        '2025-02-26': 'https://youtu.be/qs8_VefQvpk?si=C9wNe3Q84J2MvDKR',
        '2025-02-27': 'https://youtu.be/Dk21IuMwpec?si=Mj5vs3wPjqhi5DXY',
        '2025-02-28': 'https://youtu.be/kW0-IK5AvUY?si=g0ZPVTBt1-lFvXXi',
        '2025-03-01': 'https://youtu.be/-hSma-BRzoo?si=tU-87WyAz9OFBDTs',
        '2025-03-02': 'https://youtu.be/UIPvIYsjfpo?si=zUAOmF6f2s_Y1tMG',
        '2025-03-03': 'https://youtu.be/Yu20j5jGHTc?si=7oOVfqy3gRRksMBC',
        '2025-03-04': 'https://youtu.be/0Grvq1Kz6L8?si=sRmgMW0S5XvE25Ic',
        '2025-03-05': 'https://youtu.be/M7qogNry8t4?si=M6JHAbHbZvqqHyfC',
        '2025-03-06': 'https://youtu.be/FeR-4_Opt-g?si=rDKhjosmhaV7wjpy',
        '2025-03-07': 'https://youtu.be/8aXwejFPDTw?si=qqcTnYuKkU0ZP_mp',
        '2025-03-08': 'https://youtu.be/Tz9d7By2ytQ?si=ijawAmYWG96LigyM',
        '2025-03-09': 'https://youtu.be/BdhqubW1GJE?si=uVemsGx8BIdhxkFM',
        '2025-03-10': 'https://youtu.be/uUKAYkQZXko?si=27S0Yq7t4VMCnR-S',
        '2025-03-11': 'https://youtu.be/-MRNjTr6xrE?si=dVvZ_pUuOgcs47Pe',
        '2025-03-12': 'https://youtu.be/M7qogNry8t4?si=M6JHAbHbZvqqHyfC',
        '2025-03-13': 'https://youtu.be/KeNObkhENKQ?si=LPdjTfJgWVqOIxjE',
        '2025-03-14': 'https://youtu.be/8gQbgyTlS-8?si=P5ot6zYfHUPZYPJ2',
        '2025-03-15': 'https://youtu.be/lJla0_b8spI?si=kTFO4j9clzjZU1zC',
        '2025-03-16': 'https://youtu.be/L7OWsJ97ANs?si=k84XqHvNBvrH2Tyy',
        '2025-03-17': 'https://youtu.be/N-15wUPnqpc?si=J9TUaN_sAwsrftXB',
        '2025-03-18': 'https://youtu.be/ho8fvPH_Ro0?si=NSMwLZf5_GUEdjyE',
        '2025-03-19': 'https://youtu.be/TGiFtW8zy3w?si=TcAnP2fZ4crOMNWM',
        '2025-03-20': 'https://youtu.be/h5tFiJVTQBw?si=3HXx2wuj7RE9fp7N',
        '2025-03-21': 'https://youtu.be/Q2cMMnUuKYQ?si=Pw4joB9mJ0FoWjnM',
        '2025-03-22': 'https://youtu.be/59tchbMrjIg?si=JssXGkvR3TwwLkym',
        '2025-03-23': 'https://youtu.be/kuUZYUBHryw?si=CrEq0C0sUdIEemBX',
        '2025-03-24': 'https://youtu.be/0Grvq1Kz6L8?si=jPN6t7cxXyB8wOm_',
        '2025-03-25': 'https://youtu.be/J212vz33gU4?si=ih-p8the1Qk_Z7VR',
        '2025-03-26': 'https://youtu.be/qs8_VefQvpk?si=C9wNe3Q84J2MvDKR',
        '2025-03-27': 'https://youtu.be/Dk21IuMwpec?si=Mj5vs3wPjqhi5DXY',
        '2025-03-28': 'https://youtu.be/kW0-IK5AvUY?si=g0ZPVTBt1-lFvXXi',
        '2025-03-29': 'https://youtu.be/FeR-4_Opt-g?si=tT4KUx9s-XPwBGGP',
        '2025-03-30': 'https://youtu.be/_fesO5oNcEs?si=fL7M-wkLmnBYVqrO',
        '2025-03-31': 'https://youtu.be/cbKkB3POqaY?si=lTJxZeCKWvgBPKcv',
        '2025-04-01': 'https://youtu.be/-hSma-BRzoo?si=tU-87WyAz9OFBDTs',
        '2025-04-02': 'https://youtu.be/UIPvIYsjfpo?si=zUAOmF6f2s_Y1tMG',
        '2025-04-03': 'https://youtu.be/Yu20j5jGHTc?si=7oOVfqy3gRRksMBC',
        '2025-04-04': 'https://youtu.be/0Grvq1Kz6L8?si=sRmgMW0S5XvE25Ic',
        '2025-04-05': 'https://youtu.be/M7qogNry8t4?si=M6JHAbHbZvqqHyfC',
        '2025-04-06': 'https://youtu.be/FeR-4_Opt-g?si=rDKhjosmhaV7wjpy',
        '2025-04-07': 'https://youtu.be/8aXwejFPDTw?si=qqcTnYuKkU0ZP_mp',
        '2025-04-08': 'https://youtu.be/Tz9d7By2ytQ?si=ijawAmYWG96LigyM',
        '2025-04-09': 'https://youtu.be/BdhqubW1GJE?si=uVemsGx8BIdhxkFM',
        '2025-04-10': 'https://youtu.be/uUKAYkQZXko?si=27S0Yq7t4VMCnR-S',
        '2025-04-11': 'https://youtu.be/-MRNjTr6xrE?si=dVvZ_pUuOgcs47Pe',
        '2025-04-12': 'https://youtu.be/M7qogNry8t4?si=M6JHAbHbZvqqHyfC',
        '2025-04-13': 'https://youtu.be/KeNObkhENKQ?si=LPdjTfJgWVqOIxjE',
        '2025-04-14': 'https://youtu.be/8gQbgyTlS-8?si=P5ot6zYfHUPZYPJ2',
        '2025-04-15': 'https://youtu.be/lJla0_b8spI?si=kTFO4j9clzjZU1zC',
        '2025-04-16': 'https://youtu.be/L7OWsJ97ANs?si=k84XqHvNBvrH2Tyy',
        '2025-04-17': 'https://youtu.be/N-15wUPnqpc?si=J9TUaN_sAwsrftXB',
        '2025-04-18': 'https://youtu.be/ho8fvPH_Ro0?si=NSMwLZf5_GUEdjyE',
        '2025-04-19': 'https://youtu.be/TGiFtW8zy3w?si=TcAnP2fZ4crOMNWM',
        '2025-04-20': 'https://youtu.be/h5tFiJVTQBw?si=3HXx2wuj7RE9fp7N',
        '2025-04-21': 'https://youtu.be/Q2cMMnUuKYQ?si=Pw4joB9mJ0FoWjnM',
        '2025-04-22': 'https://youtu.be/59tchbMrjIg?si=JssXGkvR3TwwLkym',
        '2025-04-23': 'https://youtu.be/kuUZYUBHryw?si=CrEq0C0sUdIEemBX',
        '2025-04-24': 'https://youtu.be/0Grvq1Kz6L8?si=jPN6t7cxXyB8wOm_',
        '2025-04-25': 'https://youtu.be/J212vz33gU4?si=ih-p8the1Qk_Z7VR',
        '2025-04-26': 'https://youtu.be/qs8_VefQvpk?si=C9wNe3Q84J2MvDKR',
        '2025-04-27': 'https://youtu.be/Dk21IuMwpec?si=Mj5vs3wPjqhi5DXY',
        '2025-04-28': 'https://youtu.be/kW0-IK5AvUY?si=g0ZPVTBt1-lFvXXi',
        '2025-04-29': 'https://youtu.be/FeR-4_Opt-g?si=tT4KUx9s-XPwBGGP',
        '2025-04-30': 'https://youtu.be/_fesO5oNcEs?si=fL7M-wkLmnBYVqrO',
        '2025-05-01': 'https://youtu.be/-hSma-BRzoo?si=tU-87WyAz9OFBDTs',
        '2025-05-02': 'https://youtu.be/UIPvIYsjfpo?si=zUAOmF6f2s_Y1tMG',
        '2025-05-03': 'https://youtu.be/Yu20j5jGHTc?si=7oOVfqy3gRRksMBC',
        '2025-05-04': 'https://youtu.be/0Grvq1Kz6L8?si=sRmgMW0S5XvE25Ic',
        '2025-05-05': 'https://youtu.be/M7qogNry8t4?si=M6JHAbHbZvqqHyfC',
        '2025-05-06': 'https://youtu.be/FeR-4_Opt-g?si=rDKhjosmhaV7wjpy',
        '2025-05-07': 'https://youtu.be/8aXwejFPDTw?si=qqcTnYuKkU0ZP_mp',
        '2025-05-08': 'https://youtu.be/Tz9d7By2ytQ?si=ijawAmYWG96LigyM',
        '2025-05-09': 'https://youtu.be/BdhqubW1GJE?si=uVemsGx8BIdhxkFM',
        '2025-05-10': 'https://youtu.be/uUKAYkQZXko?si=27S0Yq7t4VMCnR-S',
        '2025-05-11': 'https://youtu.be/-MRNjTr6xrE?si=dVvZ_pUuOgcs47Pe',
        '2025-05-12': 'https://youtu.be/M7qogNry8t4?si=M6JHAbHbZvqqHyfC',
        '2025-05-13': 'https://youtu.be/KeNObkhENKQ?si=LPdjTfJgWVqOIxjE',
        '2025-05-14': 'https://youtu.be/8gQbgyTlS-8?si=P5ot6zYfHUPZYPJ2',
        '2025-05-15': 'https://youtu.be/lJla0_b8spI?si=kTFO4j9clzjZU1zC',
        '2025-05-16': 'https://youtu.be/L7OWsJ97ANs?si=k84XqHvNBvrH2Tyy',
        '2025-05-17': 'https://youtu.be/N-15wUPnqpc?si=J9TUaN_sAwsrftXB',
        '2025-05-18': 'https://youtu.be/ho8fvPH_Ro0?si=NSMwLZf5_GUEdjyE',
        '2025-05-19': 'https://youtu.be/TGiFtW8zy3w?si=TcAnP2fZ4crOMNWM',
        '2025-05-20': 'https://youtu.be/h5tFiJVTQBw?si=3HXx2wuj7RE9fp7N',
        '2025-05-21': 'https://youtu.be/Q2cMMnUuKYQ?si=Pw4joB9mJ0FoWjnM',
        '2025-05-22': 'https://youtu.be/59tchbMrjIg?si=JssXGkvR3TwwLkym',
        '2025-05-23': 'https://youtu.be/kuUZYUBHryw?si=CrEq0C0sUdIEemBX',
        '2025-05-24': 'https://youtu.be/0Grvq1Kz6L8?si=jPN6t7cxXyB8wOm_',
        '2025-05-25': 'https://youtu.be/J212vz33gU4?si=ih-p8the1Qk_Z7VR',
        '2025-05-26': 'https://youtu.be/qs8_VefQvpk?si=C9wNe3Q84J2MvDKR',
        '2025-05-27': 'https://youtu.be/Dk21IuMwpec?si=Mj5vs3wPjqhi5DXY',
        '2025-05-28': 'https://youtu.be/kW0-IK5AvUY?si=g0ZPVTBt1-lFvXXi',
        '2025-05-29': 'https://youtu.be/FeR-4_Opt-g?si=tT4KUx9s-XPwBGGP',
        '2025-05-30': 'https://youtu.be/_fesO5oNcEs?si=fL7M-wkLmnBYVqrO',
        '2025-05-31': 'https://youtu.be/cbKkB3POqaY?si=lTJxZeCKWvgBPKcv',
        '2025-06-01': 'https://youtu.be/-hSma-BRzoo?si=tU-87WyAz9OFBDTs',
        '2025-06-02': 'https://youtu.be/UIPvIYsjfpo?si=zUAOmF6f2s_Y1tMG',
        '2025-06-03': 'https://youtu.be/Yu20j5jGHTc?si=7oOVfqy3gRRksMBC',
        '2025-06-04': 'https://youtu.be/0Grvq1Kz6L8?si=sRmgMW0S5XvE25Ic',
        '2025-06-05': 'https://youtu.be/M7qogNry8t4?si=M6JHAbHbZvqqHyfC',
        '2025-06-06': 'https://youtu.be/FeR-4_Opt-g?si=rDKhjosmhaV7wjpy',
        '2025-06-07': 'https://youtu.be/8aXwejFPDTw?si=qqcTnYuKkU0ZP_mp',
        '2025-06-08': 'https://youtu.be/Tz9d7By2ytQ?si=ijawAmYWG96LigyM',
        '2025-06-09': 'https://youtu.be/BdhqubW1GJE?si=uVemsGx8BIdhxkFM',
        '2025-06-10': 'https://youtu.be/uUKAYkQZXko?si=27S0Yq7t4VMCnR-S',
        '2025-06-11': 'https://youtu.be/-MRNjTr6xrE?si=dVvZ_pUuOgcs47Pe',
        '2025-06-12': 'https://youtu.be/M7qogNry8t4?si=M6JHAbHbZvqqHyfC',
        '2025-06-13': 'https://youtu.be/KeNObkhENKQ?si=LPdjTfJgWVqOIxjE',
        '2025-06-14': 'https://youtu.be/8gQbgyTlS-8?si=P5ot6zYfHUPZYPJ2',
        '2025-06-15': 'https://youtu.be/lJla0_b8spI?si=kTFO4j9clzjZU1zC',
        '2025-06-16': 'https://youtu.be/L7OWsJ97ANs?si=k84XqHvNBvrH2Tyy',
        '2025-06-17': 'https://youtu.be/N-15wUPnqpc?si=J9TUaN_sAwsrftXB',
        '2025-06-18': 'https://youtu.be/ho8fvPH_Ro0?si=NSMwLZf5_GUEdjyE',
        '2025-06-19': 'https://youtu.be/TGiFtW8zy3w?si=TcAnP2fZ4crOMNWM',
        '2025-06-20': 'https://youtu.be/h5tFiJVTQBw?si=3HXx2wuj7RE9fp7N',
        '2025-06-21': 'https://youtu.be/Q2cMMnUuKYQ?si=Pw4joB9mJ0FoWjnM',
        '2025-06-22': 'https://youtu.be/59tchbMrjIg?si=JssXGkvR3TwwLkym',
        '2025-06-23': 'https://youtu.be/kuUZYUBHryw?si=CrEq0C0sUdIEemBX',
        '2025-06-24': 'https://youtu.be/0Grvq1Kz6L8?si=jPN6t7cxXyB8wOm_',
        '2025-06-25': 'https://youtu.be/J212vz33gU4?si=ih-p8the1Qk_Z7VR',
        '2025-06-26': 'https://youtu.be/qs8_VefQvpk?si=C9wNe3Q84J2MvDKR',
        '2025-06-27': 'https://youtu.be/Dk21IuMwpec?si=Mj5vs3wPjqhi5DXY',
        '2025-06-28': 'https://youtu.be/kW0-IK5AvUY?si=g0ZPVTBt1-lFvXXi',
        '2025-06-29': 'https://youtu.be/FeR-4_Opt-g?si=tT4KUx9s-XPwBGGP',
        '2025-06-30': 'https://youtu.be/_fesO5oNcEs?si=fL7M-wkLmnBYVqrO',
        '2025-07-01': 'https://youtu.be/-hSma-BRzoo?si=tU-87WyAz9OFBDTs',
        '2025-07-02': 'https://youtu.be/UIPvIYsjfpo?si=zUAOmF6f2s_Y1tMG',
        '2025-07-03': 'https://youtu.be/Yu20j5jGHTc?si=7oOVfqy3gRRksMBC',
        '2025-07-04': 'https://youtu.be/0Grvq1Kz6L8?si=sRmgMW0S5XvE25Ic',
        '2025-07-05': 'https://youtu.be/M7qogNry8t4?si=M6JHAbHbZvqqHyfC',
        '2025-07-06': 'https://youtu.be/FeR-4_Opt-g?si=rDKhjosmhaV7wjpy',
        '2025-07-07': 'https://youtu.be/8aXwejFPDTw?si=qqcTnYuKkU0ZP_mp',
        '2025-07-08': 'https://youtu.be/Tz9d7By2ytQ?si=ijawAmYWG96LigyM',
        '2025-07-09': 'https://youtu.be/BdhqubW1GJE?si=uVemsGx8BIdhxkFM',
        '2025-07-10': 'https://youtu.be/uUKAYkQZXko?si=27S0Yq7t4VMCnR-S',
        '2025-07-11': 'https://youtu.be/-MRNjTr6xrE?si=dVvZ_pUuOgcs47Pe',
        '2025-07-12': 'https://youtu.be/M7qogNry8t4?si=M6JHAbHbZvqqHyfC',
        '2025-07-13': 'https://youtu.be/KeNObkhENKQ?si=LPdjTfJgWVqOIxjE',
        '2025-07-14': 'https://youtu.be/8gQbgyTlS-8?si=P5ot6zYfHUPZYPJ2',
        '2025-07-15': 'https://youtu.be/lJla0_b8spI?si=kTFO4j9clzjZU1zC',
        '2025-07-16': 'https://youtu.be/L7OWsJ97ANs?si=k84XqHvNBvrH2Tyy',
        '2025-07-17': 'https://youtu.be/N-15wUPnqpc?si=J9TUaN_sAwsrftXB',
        '2025-07-18': 'https://youtu.be/ho8fvPH_Ro0?si=NSMwLZf5_GUEdjyE',
        '2025-07-19': 'https://youtu.be/TGiFtW8zy3w?si=TcAnP2fZ4crOMNWM',
        '2025-07-20': 'https://youtu.be/h5tFiJVTQBw?si=3HXx2wuj7RE9fp7N',
        '2025-07-21': 'https://youtu.be/Q2cMMnUuKYQ?si=Pw4joB9mJ0FoWjnM',
        '2025-07-22': 'https://youtu.be/59tchbMrjIg?si=JssXGkvR3TwwLkym',
        '2025-07-23': 'https://youtu.be/kuUZYUBHryw?si=CrEq0C0sUdIEemBX',
        '2025-07-24': 'https://youtu.be/0Grvq1Kz6L8?si=jPN6t7cxXyB8wOm_',
        '2025-07-25': 'https://youtu.be/J212vz33gU4?si=ih-p8the1Qk_Z7VR',
        '2025-07-26': 'https://youtu.be/qs8_VefQvpk?si=C9wNe3Q84J2MvDKR',
        '2025-07-27': 'https://youtu.be/Dk21IuMwpec?si=Mj5vs3wPjqhi5DXY',
        '2025-07-28': 'https://youtu.be/kW0-IK5AvUY?si=g0ZPVTBt1-lFvXXi',
        '2025-07-29': 'https://youtu.be/FeR-4_Opt-g?si=tT4KUx9s-XPwBGGP',
        '2025-07-30': 'https://youtu.be/_fesO5oNcEs?si=fL7M-wkLmnBYVqrO',
        '2025-07-31': 'https://youtu.be/cbKkB3POqaY?si=lTJxZeCKWvgBPKcv',
        '2025-08-01': 'https://youtu.be/-hSma-BRzoo?si=tU-87WyAz9OFBDTs',
        '2025-08-02': 'https://youtu.be/UIPvIYsjfpo?si=zUAOmF6f2s_Y1tMG',
        '2025-08-03': 'https://youtu.be/Yu20j5jGHTc?si=7oOVfqy3gRRksMBC',
        '2025-08-04': 'https://youtu.be/0Grvq1Kz6L8?si=sRmgMW0S5XvE25Ic',
        '2025-08-05': 'https://youtu.be/M7qogNry8t4?si=M6JHAbHbZvqqHyfC',
        '2025-08-06': 'https://youtu.be/FeR-4_Opt-g?si=rDKhjosmhaV7wjpy',
        '2025-08-07': 'https://youtu.be/8aXwejFPDTw?si=qqcTnYuKkU0ZP_mp',
        '2025-08-08': 'https://youtu.be/Tz9d7By2ytQ?si=ijawAmYWG96LigyM',
        '2025-08-09': 'https://youtu.be/BdhqubW1GJE?si=uVemsGx8BIdhxkFM',
        '2025-08-10': 'https://youtu.be/uUKAYkQZXko?si=27S0Yq7t4VMCnR-S',
        '2025-08-11': 'https://youtu.be/-MRNjTr6xrE?si=dVvZ_pUuOgcs47Pe',
        '2025-08-12': 'https://youtu.be/M7qogNry8t4?si=M6JHAbHbZvqqHyfC',
        '2025-08-13': 'https://youtu.be/KeNObkhENKQ?si=LPdjTfJgWVqOIxjE',
        '2025-08-14': 'https://youtu.be/8gQbgyTlS-8?si=P5ot6zYfHUPZYPJ2',
        '2025-08-15': 'https://youtu.be/lJla0_b8spI?si=kTFO4j9clzjZU1zC',
        '2025-08-16': 'https://youtu.be/L7OWsJ97ANs?si=k84XqHvNBvrH2Tyy',
        '2025-08-17': 'https://youtu.be/N-15wUPnqpc?si=J9TUaN_sAwsrftXB',
        '2025-08-18': 'https://youtu.be/ho8fvPH_Ro0?si=NSMwLZf5_GUEdjyE',
        '2025-08-19': 'https://youtu.be/TGiFtW8zy3w?si=TcAnP2fZ4crOMNWM',
        '2025-08-20': 'https://youtu.be/h5tFiJVTQBw?si=3HXx2wuj7RE9fp7N',
        '2025-08-21': 'https://youtu.be/Q2cMMnUuKYQ?si=Pw4joB9mJ0FoWjnM',
        '2025-08-22': 'https://youtu.be/59tchbMrjIg?si=JssXGkvR3TwwLkym',
        '2025-08-23': 'https://youtu.be/kuUZYUBHryw?si=CrEq0C0sUdIEemBX',
        '2025-08-24': 'https://youtu.be/0Grvq1Kz6L8?si=jPN6t7cxXyB8wOm_',
        '2025-08-25': 'https://youtu.be/J212vz33gU4?si=ih-p8the1Qk_Z7VR',
        '2025-08-26': 'https://youtu.be/qs8_VefQvpk?si=C9wNe3Q84J2MvDKR',
        '2025-08-27': 'https://youtu.be/Dk21IuMwpec?si=Mj5vs3wPjqhi5DXY',
        '2025-08-28': 'https://youtu.be/kW0-IK5AvUY?si=g0ZPVTBt1-lFvXXi',
        '2025-08-29': 'https://youtu.be/FeR-4_Opt-g?si=tT4KUx9s-XPwBGGP',
        '2025-08-30': 'https://youtu.be/_fesO5oNcEs?si=fL7M-wkLmnBYVqrO',
        '2025-08-31': 'https://youtu.be/cbKkB3POqaY?si=lTJxZeCKWvgBPKcv',
        '2025-09-01': 'https://youtu.be/-hSma-BRzoo?si=tU-87WyAz9OFBDTs',
        '2025-09-02': 'https://youtu.be/UIPvIYsjfpo?si=zUAOmF6f2s_Y1tMG',
        '2025-09-03': 'https://youtu.be/Yu20j5jGHTc?si=7oOVfqy3gRRksMBC',
        '2025-09-04': 'https://youtu.be/0Grvq1Kz6L8?si=sRmgMW0S5XvE25Ic',
        '2025-09-05': 'https://youtu.be/M7qogNry8t4?si=M6JHAbHbZvqqHyfC',
        '2025-09-06': 'https://youtu.be/FeR-4_Opt-g?si=rDKhjosmhaV7wjpy',
        '2025-09-07': 'https://youtu.be/8aXwejFPDTw?si=qqcTnYuKkU0ZP_mp',
        '2025-09-08': 'https://youtu.be/Tz9d7By2ytQ?si=ijawAmYWG96LigyM',
        '2025-09-09': 'https://youtu.be/BdhqubW1GJE?si=uVemsGx8BIdhxkFM',
        '2025-09-10': 'https://youtu.be/uUKAYkQZXko?si=27S0Yq7t4VMCnR-S',
        '2025-09-11': 'https://youtu.be/-MRNjTr6xrE?si=dVvZ_pUuOgcs47Pe',
        '2025-09-12': 'https://youtu.be/M7qogNry8t4?si=M6JHAbHbZvqqHyfC',
        '2025-09-13': 'https://youtu.be/KeNObkhENKQ?si=LPdjTfJgWVqOIxjE',
        '2025-09-14': 'https://youtu.be/8gQbgyTlS-8?si=P5ot6zYfHUPZYPJ2',
        '2025-09-15': 'https://youtu.be/lJla0_b8spI?si=kTFO4j9clzjZU1zC',
        '2025-09-16': 'https://youtu.be/L7OWsJ97ANs?si=k84XqHvNBvrH2Tyy',
        '2025-09-17': 'https://youtu.be/N-15wUPnqpc?si=J9TUaN_sAwsrftXB',
        '2025-09-18': 'https://youtu.be/ho8fvPH_Ro0?si=NSMwLZf5_GUEdjyE',
        '2025-09-19': 'https://youtu.be/TGiFtW8zy3w?si=TcAnP2fZ4crOMNWM',
        '2025-09-20': 'https://youtu.be/h5tFiJVTQBw?si=3HXx2wuj7RE9fp7N',
        '2025-09-21': 'https://youtu.be/Q2cMMnUuKYQ?si=Pw4joB9mJ0FoWjnM',
        '2025-09-22': 'https://youtu.be/59tchbMrjIg?si=JssXGkvR3TwwLkym',
        '2025-09-23': 'https://youtu.be/kuUZYUBHryw?si=CrEq0C0sUdIEemBX',
        '2025-09-24': 'https://youtu.be/0Grvq1Kz6L8?si=jPN6t7cxXyB8wOm_',
        '2025-09-25': 'https://youtu.be/J212vz33gU4?si=ih-p8the1Qk_Z7VR',
        '2025-09-26': 'https://youtu.be/qs8_VefQvpk?si=C9wNe3Q84J2MvDKR',
        '2025-09-27': 'https://youtu.be/Dk21IuMwpec?si=Mj5vs3wPjqhi5DXY',
        '2025-09-28': 'https://youtu.be/kW0-IK5AvUY?si=g0ZPVTBt1-lFvXXi',
        '2025-09-29': 'https://youtu.be/FeR-4_Opt-g?si=tT4KUx9s-XPwBGGP',
        '2025-09-30': 'https://youtu.be/_fesO5oNcEs?si=fL7M-wkLmnBYVqrO',
        '2025-10-01': 'https://youtu.be/-hSma-BRzoo?si=tU-87WyAz9OFBDTs',
        '2025-10-02': 'https://youtu.be/UIPvIYsjfpo?si=zUAOmF6f2s_Y1tMG',
        '2025-10-03': 'https://youtu.be/Yu20j5jGHTc?si=7oOVfqy3gRRksMBC',
        '2025-10-04': 'https://youtu.be/0Grvq1Kz6L8?si=sRmgMW0S5XvE25Ic',
        '2025-10-05': 'https://youtu.be/M7qogNry8t4?si=M6JHAbHbZvqqHyfC',
        '2025-10-06': 'https://youtu.be/FeR-4_Opt-g?si=rDKhjosmhaV7wjpy',
        '2025-10-07': 'https://youtu.be/8aXwejFPDTw?si=qqcTnYuKkU0ZP_mp',
        '2025-10-08': 'https://youtu.be/Tz9d7By2ytQ?si=ijawAmYWG96LigyM',
        '2025-10-09': 'https://youtu.be/BdhqubW1GJE?si=uVemsGx8BIdhxkFM',
        '2025-10-10': 'https://youtu.be/uUKAYkQZXko?si=27S0Yq7t4VMCnR-S',
        '2025-10-11': 'https://youtu.be/-MRNjTr6xrE?si=dVvZ_pUuOgcs47Pe',
        '2025-10-12': 'https://youtu.be/M7qogNry8t4?si=M6JHAbHbZvqqHyfC',
        '2025-10-13': 'https://youtu.be/KeNObkhENKQ?si=LPdjTfJgWVqOIxjE',
        '2025-10-14': 'https://youtu.be/8gQbgyTlS-8?si=P5ot6zYfHUPZYPJ2',
        '2025-10-15': 'https://youtu.be/lJla0_b8spI?si=kTFO4j9clzjZU1zC',
        '2025-10-16': 'https://youtu.be/L7OWsJ97ANs?si=k84XqHvNBvrH2Tyy',
        '2025-10-17': 'https://youtu.be/N-15wUPnqpc?si=J9TUaN_sAwsrftXB',
        '2025-10-18': 'https://youtu.be/ho8fvPH_Ro0?si=NSMwLZf5_GUEdjyE',
        '2025-10-19': 'https://youtu.be/TGiFtW8zy3w?si=TcAnP2fZ4crOMNWM',
        '2025-10-20': 'https://youtu.be/h5tFiJVTQBw?si=3HXx2wuj7RE9fp7N',
        '2025-10-21': 'https://youtu.be/Q2cMMnUuKYQ?si=Pw4joB9mJ0FoWjnM',
        '2025-10-22': 'https://youtu.be/59tchbMrjIg?si=JssXGkvR3TwwLkym',
        '2025-10-23': 'https://youtu.be/kuUZYUBHryw?si=CrEq0C0sUdIEemBX',
        '2025-10-24': 'https://youtu.be/0Grvq1Kz6L8?si=jPN6t7cxXyB8wOm_',
        '2025-10-25': 'https://youtu.be/J212vz33gU4?si=ih-p8the1Qk_Z7VR',
        '2025-10-26': 'https://youtu.be/qs8_VefQvpk?si=C9wNe3Q84J2MvDKR',
        '2025-10-27': 'https://youtu.be/Dk21IuMwpec?si=Mj5vs3wPjqhi5DXY',
        '2025-10-28': 'https://youtu.be/kW0-IK5AvUY?si=g0ZPVTBt1-lFvXXi',
        '2025-10-29': 'https://youtu.be/FeR-4_Opt-g?si=tT4KUx9s-XPwBGGP',
        '2025-10-30': 'https://youtu.be/_fesO5oNcEs?si=fL7M-wkLmnBYVqrO',
        '2025-10-31': 'https://youtu.be/cbKkB3POqaY?si=lTJxZeCKWvgBPKcv',
        '2025-11-01': 'https://youtu.be/-hSma-BRzoo?si=tU-87WyAz9OFBDTs',
        '2025-11-02': 'https://youtu.be/UIPvIYsjfpo?si=zUAOmF6f2s_Y1tMG',
        '2025-11-03': 'https://youtu.be/Yu20j5jGHTc?si=7oOVfqy3gRRksMBC',
        '2025-11-04': 'https://youtu.be/0Grvq1Kz6L8?si=sRmgMW0S5XvE25Ic',
        '2025-11-05': 'https://youtu.be/M7qogNry8t4?si=M6JHAbHbZvqqHyfC',
        '2025-11-06': 'https://youtu.be/FeR-4_Opt-g?si=rDKhjosmhaV7wjpy',
        '2025-11-07': 'https://youtu.be/8aXwejFPDTw?si=qqcTnYuKkU0ZP_mp',
        '2025-11-08': 'https://youtu.be/Tz9d7By2ytQ?si=ijawAmYWG96LigyM',
        '2025-11-09': 'https://youtu.be/BdhqubW1GJE?si=uVemsGx8BIdhxkFM',
        '2025-11-10': 'https://youtu.be/uUKAYkQZXko?si=27S0Yq7t4VMCnR-S',
        '2025-11-11': 'https://youtu.be/-MRNjTr6xrE?si=dVvZ_pUuOgcs47Pe',
        '2025-11-12': 'https://youtu.be/M7qogNry8t4?si=M6JHAbHbZvqqHyfC',
        '2025-11-13': 'https://youtu.be/KeNObkhENKQ?si=LPdjTfJgWVqOIxjE',
        '2025-11-14': 'https://youtu.be/8gQbgyTlS-8?si=P5ot6zYfHUPZYPJ2',
        '2025-11-15': 'https://youtu.be/lJla0_b8spI?si=kTFO4j9clzjZU1zC',
        '2025-11-16': 'https://youtu.be/L7OWsJ97ANs?si=k84XqHvNBvrH2Tyy',
        '2025-11-17': 'https://youtu.be/N-15wUPnqpc?si=J9TUaN_sAwsrftXB',
        '2025-11-18': 'https://youtu.be/ho8fvPH_Ro0?si=NSMwLZf5_GUEdjyE',
        '2025-11-19': 'https://youtu.be/TGiFtW8zy3w?si=TcAnP2fZ4crOMNWM',
        '2025-11-20': 'https://youtu.be/h5tFiJVTQBw?si=3HXx2wuj7RE9fp7N',
        '2025-11-21': 'https://youtu.be/Q2cMMnUuKYQ?si=Pw4joB9mJ0FoWjnM',
        '2025-11-22': 'https://youtu.be/59tchbMrjIg?si=JssXGkvR3TwwLkym',
        '2025-11-23': 'https://youtu.be/kuUZYUBHryw?si=CrEq0C0sUdIEemBX',
        '2025-11-24': 'https://youtu.be/0Grvq1Kz6L8?si=jPN6t7cxXyB8wOm_',
        '2025-11-25': 'https://youtu.be/J212vz33gU4?si=ih-p8the1Qk_Z7VR',
        '2025-11-26': 'https://youtu.be/qs8_VefQvpk?si=C9wNe3Q84J2MvDKR',
        '2025-11-27': 'https://youtu.be/Dk21IuMwpec?si=Mj5vs3wPjqhi5DXY',
        '2025-11-28': 'https://youtu.be/kW0-IK5AvUY?si=g0ZPVTBt1-lFvXXi',
        '2025-11-29': 'https://youtu.be/FeR-4_Opt-g?si=tT4KUx9s-XPwBGGP',
        '2025-11-30': 'https://youtu.be/_fesO5oNcEs?si=fL7M-wkLmnBYVqrO',
        '2025-12-01': 'https://youtu.be/-hSma-BRzoo?si=tU-87WyAz9OFBDTs',
        '2025-12-02': 'https://youtu.be/UIPvIYsjfpo?si=zUAOmF6f2s_Y1tMG',
        '2025-12-03': 'https://youtu.be/Yu20j5jGHTc?si=7oOVfqy3gRRksMBC',
        '2025-12-04': 'https://youtu.be/0Grvq1Kz6L8?si=sRmgMW0S5XvE25Ic',
        '2025-12-05': 'https://youtu.be/M7qogNry8t4?si=M6JHAbHbZvqqHyfC',
        '2025-12-06': 'https://youtu.be/FeR-4_Opt-g?si=rDKhjosmhaV7wjpy',
        '2025-12-07': 'https://youtu.be/8aXwejFPDTw?si=qqcTnYuKkU0ZP_mp',
        '2025-12-08': 'https://youtu.be/Tz9d7By2ytQ?si=ijawAmYWG96LigyM',
        '2025-12-09': 'https://youtu.be/BdhqubW1GJE?si=uVemsGx8BIdhxkFM',
        '2025-12-10': 'https://youtu.be/uUKAYkQZXko?si=27S0Yq7t4VMCnR-S',
        '2025-12-11': 'https://youtu.be/-MRNjTr6xrE?si=dVvZ_pUuOgcs47Pe',
        '2025-12-12': 'https://youtu.be/M7qogNry8t4?si=M6JHAbHbZvqqHyfC',
        '2025-12-13': 'https://youtu.be/KeNObkhENKQ?si=LPdjTfJgWVqOIxjE',
        '2025-12-14': 'https://youtu.be/8gQbgyTlS-8?si=P5ot6zYfHUPZYPJ2',
        '2025-12-15': 'https://youtu.be/lJla0_b8spI?si=kTFO4j9clzjZU1zC',
        '2025-12-16': 'https://youtu.be/L7OWsJ97ANs?si=k84XqHvNBvrH2Tyy',
        '2025-12-17': 'https://youtu.be/N-15wUPnqpc?si=J9TUaN_sAwsrftXB',
        '2025-12-18': 'https://youtu.be/ho8fvPH_Ro0?si=NSMwLZf5_GUEdjyE',
        '2025-12-19': 'https://youtu.be/TGiFtW8zy3w?si=TcAnP2fZ4crOMNWM',
        '2025-12-20': 'https://youtu.be/h5tFiJVTQBw?si=3HXx2wuj7RE9fp7N',
        '2025-12-21': 'https://youtu.be/Q2cMMnUuKYQ?si=Pw4joB9mJ0FoWjnM',
        '2025-12-22': 'https://youtu.be/59tchbMrjIg?si=JssXGkvR3TwwLkym',
        '2025-12-23': 'https://youtu.be/kuUZYUBHryw?si=CrEq0C0sUdIEemBX',
        '2025-12-24': 'https://youtu.be/0Grvq1Kz6L8?si=jPN6t7cxXyB8wOm_',
        '2025-12-25': 'https://youtu.be/J212vz33gU4?si=ih-p8the1Qk_Z7VR',
        '2025-12-26': 'https://youtu.be/qs8_VefQvpk?si=C9wNe3Q84J2MvDKR',
        '2025-12-27': 'https://youtu.be/Dk21IuMwpec?si=Mj5vs3wPjqhi5DXY',
        '2025-12-28': 'https://youtu.be/kW0-IK5AvUY?si=g0ZPVTBt1-lFvXXi',
        '2025-12-29': 'https://youtu.be/FeR-4_Opt-g?si=tT4KUx9s-XPwBGGP',
        '2025-12-30': 'https://youtu.be/_fesO5oNcEs?si=fL7M-wkLmnBYVqrO',
        '2025-12-31': 'https://youtu.be/cbKkB3POqaY?si=lTJxZeCKWvgBPKcv',
    }
    def on_date_click(event):
        selected_date = calendar_widget.get_date()
        if selected_date in date_to_url:
            video_url = date_to_url[selected_date] # Get the corresponding URL for the selected date
            webbrowser.open(video_url) # Open the URL in the default web browser
        else:
            messagebox.showwarning("No link available", "No URL is linked to this date.")
    calendar_widget.bind("<<CalendarSelected>>", on_date_click)
    # Settings Section
    settings_title = tk.Label( right_frame, text="Settings", font=("Arial", 18), bg="#8B0000", fg="white" )
    settings_title.pack(pady=20)
    logo_label = tk.Label(settings_title, image=logo1, bg="#8B0000")
    logo_label.pack(pady=10)
    # Account Settings Section
    def open_account_settings():
        account_window = tk.Toplevel(calendar_window)
        account_window.title("Account Settings")
        account_window.geometry("500x500")
        account_window.configure(bg="#8B0000")
        logo_label = tk.Label(account_window, image=logo1, bg="#8B0000")
        logo_label.pack(pady=10)
        # Account Info
        account_label = tk.Label(account_window, text="Account Settings", font=("Arial", 16), bg="#8B0000", fg="white")
        account_label.pack(pady=20)
        # Display Time Spent on the App
        def show_time_spent():
            if session_start_time is None:
                messagebox.showinfo("Session Time", "You haven't logged in yet.")
            else:
                session_end_time = time.time() # Get the current time when user is checking
                time_spent = session_end_time - session_start_time
                hours = int(time_spent // 3600)
                minutes = int((time_spent % 3600) // 60)
                seconds = int(time_spent % 60)
                messagebox.showinfo("Time Spent", f"Time spent in the app: {hours}h {minutes}m {seconds}s")
        time_spent_button = tk.Button( account_window, text="Check Time Spent", font=("Arial", 14), bg="#ba1414", fg="#c4c2c2", command=show_time_spent, activebackground='#8B0000', activeforeground='white', cursor='hand2', height=1, width=15, highlightbackground='#8B0000', highlightthickness=2, highlightcolor='#8B0000' )
        time_spent_button.pack(pady=10)
        # Close Account Settings Window
        close_button = tk.Button( account_window, text="Close", font=("Arial", 14), bg="#ba1414", fg="#c4c2c2", command=account_window.destroy, activebackground='#8B0000', activeforeground='white', cursor='hand2', height=1, width=15, highlightbackground='#8B0000', highlightthickness=2, highlightcolor='#8B0000' )
        close_button.pack(pady=10)
    account_settings_button = tk.Button( right_frame, text="Account Settings", font=("Arial", 14), bg="#ba1414", fg="#c4c2c2", command=open_account_settings, activebackground='#8B0000', activeforeground='white', cursor='hand2', height=1, width=13, highlightbackground='#8B0000', highlightthickness=2, highlightcolor='#8B0000' )
    account_settings_button.pack(pady=10)
    # Display Section for Changing Theme
    def open_display_settings():
        # Theme Change functionality
        theme_window = tk.Toplevel(calendar_window)
        theme_window.title("Display Settings")
        theme_window.geometry("400x300")
        theme_window.configure(bg="#8B0000")
        def change_theme(theme):
            if theme == "Dark":
                calendar_window.configure(bg="black")
                right_frame.configure(bg="black")
                left_frame.configure(bg="gray")
                messagebox.showinfo("Theme Change", "Dark theme activated!")
            elif theme == "Light":
                calendar_window.configure(bg="white")
                right_frame.configure(bg="white")
                left_frame.configure(bg="lightgray")
                messagebox.showinfo("Theme Change", "Light theme activated!")
            elif theme == "Normal":
                calendar_window.configure(bg="#C0C0C0")
                right_frame.configure(bg="#8B0000")
                left_frame.configure(bg="#C0C0C0")
                messagebox.showinfo("Theme Change", "Normal theme activated!")
            theme_window.destroy()
        dark_button = tk.Button(theme_window, text="Dark Theme", command=lambda: change_theme("Dark"), font=("Arial", 14), bg='BLACK', fg='WHITE', cursor='hand2')
        dark_button.pack(pady=10)
        light_button = tk.Button(theme_window, text="Light Theme", command=lambda: change_theme("Light"), font=("Arial", 14), bg='WHITE', fg='BLACK', cursor='hand2')
        light_button.pack(pady=10)
        normal_button = tk.Button(theme_window, text="Normal Theme", command=lambda: change_theme("Normal"), font=("Arial", 14), bg='#ba1414', fg='WHITE', cursor='hand2')
        normal_button.pack(pady=10)
    display_button = tk.Button( right_frame, text="Display Settings", font=("Arial", 14), bg="#ba1414", fg="#c4c2c2", command=open_display_settings, activebackground='#8B0000', activeforeground='white', cursor='hand2', height=1, width=13, highlightbackground='#8B0000', highlightthickness=2, highlightcolor='#8B0000' )
    display_button.pack(pady=10)
    # About Section
    def open_about():
        messagebox.showinfo("About", "This app helps you monitor your fitness progress and track your health.")
    about_button = tk.Button( right_frame, text="About", font=("Arial", 14), bg="#ba1414", fg="#c4c2c2", command=open_about, activebackground='#8B0000', activeforeground='white', cursor='hand2', height=1, width=13, highlightbackground='#8B0000', highlightthickness=2, highlightcolor='#8B0000' )
    about_button.pack(pady=10)
    # Logout Button
    def logout():
        global session_start_time
        session_start_time = None # Reset session start time
        messagebox.showinfo("Logout", "You have logged out.")
        calendar_window.destroy()
    logout_button = tk.Button( right_frame, text="Logout", font=("Arial", 14), bg="#ba1414", fg="#c4c2c2", command=logout, activebackground='#8B0000', activeforeground='white', cursor='hand2', height=1, width=13, highlightbackground='#8B0000', highlightthickness=2, highlightcolor='#8B0000' )
    logout_button.pack(pady=20)
# Main Tkinter window
root = tk.Tk()
root.title("PUP Fitness Calendar")
root.geometry("1610x900")
root.configure(bg="#8B0000")
# Custom font
title_font = ("Helvetica", 16, "bold")
button_font = ("Times New Roman", 12, "bold")
guest_font = ("Arial", 14, "bold")
# Load the image
image_path = os.path.join(os.path.dirname(__file__), "assets", "PUP.png")
image = Image.open(image_path)
image = image.resize((100, 100)) # Resize the image
logo1 = ImageTk.PhotoImage(image)
# Add the image to the window
logo_label = tk.Label(root, image=logo1, bg="#8B0000")
logo_label.pack(pady=10)
# Add "PUP Fitness Monitor" text
title_label = tk.Label( root, text="PUP Fitness Monitor", font=title_font, bg="#8B0000", fg="white" )
title_label.pack(pady=10)
# Register and Login Buttons
register_button = tk.Button( root, text="REGISTER", font=button_font, bg="#ba1414", fg="#c4c2c2", command=handle_register, activebackground='#8B0000', activeforeground='white', cursor='hand2', height=1, width=11, highlightbackground='#8B0000', highlightthickness=2, highlightcolor='white' )
register_button.pack(pady=10)
login_button = tk.Button( root, text="LOGIN", font=button_font, width=11, height=1, bg="#ba1414", fg="#c4c2c2", command=handle_login, activebackground='#8B0000', activeforeground='white', cursor='hand2', highlightbackground='#8B0000', highlightthickness=2, highlightcolor='white' )
login_button.pack(pady=10)
init_db()
root.mainloop()
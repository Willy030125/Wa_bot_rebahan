from pydub import AudioSegment
import speech_recognition as sr
from os import *

while (True):
	p = input()
	if ".opus" in p or ".ogg" in p:
		audio = AudioSegment.from_ogg(p)
		audio.export("media/input.wav", format="wav")
		AUDIO_FILE = path.join("media/input.wav")
		r = sr.Recognizer()
		with sr.AudioFile(AUDIO_FILE) as source:
			audio = r.record(source)
		print(r.recognize_google(audio, language="id"))
	else:
		print("Format audio tidak dapat diproses!")

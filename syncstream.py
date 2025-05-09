import streamlit as st
import time

# --- Mock API Functions (Same as before, for demonstration) ---
def mock_get_playlist_items(playlist_url, service_name):
    st.session_state.messages.append(
        {"role": "system", "content": f"Simulating fetching tracks from {service_name} for: {playlist_url}"}
    )
    time.sleep(1)
    if "youtube.com" in playlist_url:
        return [
            {"title": "Bohemian Rhapsody", "artist": "Queen", "album": "A Night at the Opera"},
            {"title": "Imagine", "artist": "John Lennon", "album": "Imagine"},
            {"title": "Shape of You", "artist": "Ed Sheeran", "album": "÷ (Divide)"},
            {"title": "NonExistent Song", "artist": "No One", "album": "Unknown Album"},
            {"title": "Another Brick in the Wall", "artist": "Pink Floyd", "album": "The Wall"},
        ]
    elif "spotify.com" in playlist_url:
        return [
            {"title": "Stairway to Heaven", "artist": "Led Zeppelin", "album": "Led Zeppelin IV"},
            {"title": "Like a Rolling Stone", "artist": "Bob Dylan", "album": "Highway 61 Revisited"},
        ]
    elif "music.apple.com" in playlist_url:
        return [
            {"title": "Hey Jude", "artist": "The Beatles", "album": "Hey Jude"},
            {"title": "Billie Jean", "artist": "Michael Jackson", "album": "Thriller"},
        ]
    return []

def mock_search_track_on_target(track_info, target_service_name):
    if track_info["title"] == "NonExistent Song":
        return None
    return {
        "id": f"mock_{target_service_name.lower()}_id_{track_info['title'].replace(' ', '_')}",
        "title": track_info["title"],
        "artist": track_info["artist"],
        "uri": f"mock_uri_for_{track_info['title']}"
    }

def mock_create_playlist_on_target(playlist_name, target_service_name):
    st.session_state.messages.append(
        {"role": "system", "content": f"Simulating creating playlist '{playlist_name}' on {target_service_name}"}
    )
    time.sleep(0.5)
    return f"mock_playlist_id_{playlist_name.replace(' ', '_')}"

def mock_add_tracks_to_target_playlist(playlist_id, track_uris, target_service_name):
    st.session_state.messages.append(
        {"role": "system", "content": f"Simulating adding {len(track_uris)} tracks to playlist {playlist_id} on {target_service_name}"}
    )
    time.sleep(1)
    return True

# --- Custom CSS for Styling ---
def local_css(file_name):
    with open(file_name) as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

# Create a style.css file in the same directory with the CSS content below
# For this example, I'll embed it directly for simplicity, but using a separate file is cleaner.
CSS = """
body {
    background-color: #121212; /* Very dark grey, almost black */
    color: #E0E0E0; /* Light grey for text */
    font-family: 'Roboto', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Main app container */
.main .block-container {
    padding-top: 2rem;
    padding-bottom: 2rem;
    padding-left: 1rem;
    padding-right: 1rem;
}

/* Title */
h1 {
    color: #FFFFFF; /* White */
    text-align: center;
    padding-bottom: 0.5em;
    font-weight: 700;
}
.stMarkdown h1 { /* Streamlit's markdown h1 */
    font-size: 2.8em !important;
}


/* Subheader/Section titles */
h2, .stMarkdown h2 {
    color: #BB86FC; /* Deep purple accent */
    border-bottom: 2px solid #BB86FC;
    padding-bottom: 0.3em;
    margin-top: 1.5em;
    margin-bottom: 1em;
    font-weight: 600;
}

/* Card styling */
.card {
    background-color: #1E1E1E; /* Slightly lighter dark grey */
    padding: 25px;
    border-radius: 15px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.3), 0 6px 6px rgba(0,0,0,0.25);
    margin-bottom: 25px;
    border: 1px solid #333333; /* Subtle border */
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(187, 134, 252, 0.2), 0 10px 10px rgba(187, 134, 252, 0.15);
}

/* Input fields styling */
.stTextInput > div > div > input,
.stSelectbox > div > div {
    background-color: #2C2C2C !important; /* Darker input background */
    color: #E0E0E0 !important;
    border-radius: 8px !important;
    border: 1px solid #444444 !important;
    padding: 10px 12px !important;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
.stTextInput > div > div > input:focus,
.stSelectbox > div > div:focus-within { /* For selectbox focus */
    border-color: #BB86FC !important;
    box-shadow: 0 0 0 0.2rem rgba(187, 134, 252, 0.25) !important;
}
/* Label styling for inputs */
label.css-16idsys.e16nr0p34, label.css-1qg05ue.e16nr0p34 { /* These classes might change with Streamlit versions */
     color: #B0B0B0 !important;
     font-weight: 500;
     margin-bottom: 8px !important;
}


/* Button styling */
div.stButton > button {
    background-color: #03DAC6; /* Teal accent */
    color: #121212; /* Dark text on light button */
    border: none;
    padding: 12px 30px;
    border-radius: 25px; /* More rounded */
    font-weight: bold;
    font-size: 1.1em;
    transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
    box-shadow: 0 4px 6px rgba(0,0,0,0.2);
    width: 100%; /* Make button take full width of its column */
}

div.stButton > button:hover {
    background-color: #01BEA4; /* Darker teal on hover */
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 8px 15px rgba(3, 218, 198, 0.3);
}
div.stButton > button:active {
    transform: translateY(-1px) scale(0.98);
    box-shadow: 0 2px 4px rgba(3, 218, 198, 0.2);
}

/* Expander styling */
.stExpander {
    border: 1px solid #333333 !important;
    border-radius: 10px !important;
    background-color: #2C2C2C !important; /* Slightly different background for expander */
}
.stExpander header {
    font-weight: 500;
    color: #BB86FC; /* Accent color for expander header */
}
.stExpander header:hover {
    color: #03DAC6; /* Different accent on hover */
}

/* Progress bar */
.stProgress > div > div > div > div {
    background-image: linear-gradient(to right, #BB86FC, #03DAC6); /* Gradient progress bar */
}

/* Success and Error messages */
.stAlert {
    border-radius: 8px;
    font-weight: 500;
}
.stAlert.stAlert-success {
    background-color: rgba(3, 218, 198, 0.1); /* Light teal background */
    border: 1px solid #03DAC6;
    color: #03DAC6; /* Teal text */
}
.stAlert.stAlert-error {
    background-color: rgba(207, 102, 121, 0.1); /* Light red background */
    border: 1px solid #CF6679;
    color: #CF6679; /* Red text */
}
.stAlert.stAlert-warning {
    background-color: rgba(255, 180, 0, 0.1); /* Light yellow background */
    border: 1px solid #FFB400;
    color: #FFB400; /* Yellow text */
}

/* Custom class for log messages */
.log-message {
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.9em;
    padding: 8px;
    margin: 5px 0;
    border-radius: 5px;
    background-color: #2a2a2a;
    border-left: 3px solid #BB86FC;
}
.log-message.system {
    border-left-color: #03DAC6;
}
.log-message.user { /* If you add user messages */
    border-left-color: #BB86FC;
}

/* Footer */
.footer {
    text-align: center;
    padding: 20px;
    font-size: 0.9em;
    color: #777777;
    border-top: 1px solid #333333;
    margin-top: 40px;
}
"""
st.markdown(f"<style>{CSS}</style>", unsafe_allow_html=True)

# --- Streamlit App UI ---

st.markdown("<h1>🎵 Playlist Porter  elegante</h1>", unsafe_allow_html=True)
st.markdown("<p style='text-align: center; color: #B0B0B0; margin-bottom: 2rem;'>Seamlessly transfer your music playlists across services. (UI/UX Demo)</p>", unsafe_allow_html=True)

# Initialize session state for messages if not already done
if 'messages' not in st.session_state:
    st.session_state.messages = []


# --- Main Conversion Form ---
col1, col2 = st.columns(2)

with col1:
    st.markdown("<div class='card'>", unsafe_allow_html=True)
    st.markdown("<h2>📤 Source Details</h2>", unsafe_allow_html=True)
    source_service = st.selectbox(
        "Select Source Service:",
        ("YouTube", "Spotify", "Apple Music"),
        key="source_service"
    )
    source_playlist_url = st.text_input(
        f"Enter {source_service} Playlist URL or ID:",
        key="source_url",
        placeholder=f"e.g., https://{source_service.lower()}.com/playlist/..."
    )
    st.markdown("</div>", unsafe_allow_html=True)

with col2:
    st.markdown("<div class='card'>", unsafe_allow_html=True)
    st.markdown("<h2>📥 Target Details</h2>", unsafe_allow_html=True)
    target_service = st.selectbox(
        "Select Target Service:",
        ("Spotify", "YouTube", "Apple Music"),
        key="target_service"
    )
    new_playlist_name = st.text_input(
        "Name for New Playlist on Target:",
        value="My Converted Playlist",
        key="target_playlist_name"
    )
    st.markdown("</div>", unsafe_allow_html=True)

st.markdown("<br>", unsafe_allow_html=True) # Spacer

if st.button("🚀 Convert Playlist Now", key="convert_button"):
    st.session_state.messages = [] # Clear previous messages
    if not source_playlist_url:
        st.error("❗ Please enter the source playlist URL.")
    elif source_service == target_service:
        st.warning("⚠️ Source and Target services cannot be the same.")
    else:
        st.markdown("---")
        st.markdown("<h2 style='text-align:center;'>✨ Conversion in Progress ✨</h2>", unsafe_allow_html=True)
        status_placeholder = st.empty() # For dynamic status updates

        with st.spinner(f"Initiating conversion from {source_service} to {target_service}..."):
            # 1. Fetch tracks from source
            status_placeholder.info(f"📡 Fetching tracks from {source_service}...")
            source_tracks = mock_get_playlist_items(source_playlist_url, source_service)

            if not source_tracks:
                status_placeholder.error(f"❌ Could not fetch tracks from {source_playlist_url}. Check URL or mock data.")
            else:
                status_placeholder.info(f"✅ Found {len(source_tracks)} tracks in the source playlist.")
                with st.expander("🔍 View Source Tracks"):
                    for i, track in enumerate(source_tracks):
                        st.write(f"{i+1}. {track['title']} by {track['artist']}")

                # 2. Search for tracks on target & collect URIs
                status_placeholder.info(f"🎶 Searching for tracks on {target_service}...")
                matched_tracks_info = []
                found_track_uris_on_target = []
                not_found_tracks = []

                progress_bar = st.progress(0)
                for i, track_info in enumerate(source_tracks):
                    target_track = mock_search_track_on_target(track_info, target_service)
                    if target_track:
                        matched_tracks_info.append(target_track)
                        found_track_uris_on_target.append(target_track["uri"])
                    else:
                        not_found_tracks.append(track_info)
                    progress_bar.progress((i + 1) / len(source_tracks), text=f"Processing: {track_info['title']}")
                time.sleep(0.5) # for progress bar to show completion
                progress_bar.empty()

                status_placeholder.info(f"🎯 Found {len(found_track_uris_on_target)} matching tracks on {target_service}.")

                if not_found_tracks:
                    with st.expander(f"❓ {len(not_found_tracks)} tracks not found or matched on {target_service}"):
                        for track in not_found_tracks:
                            st.write(f"- {track['title']} by {track['artist']}")

                if not found_track_uris_on_target:
                    status_placeholder.warning("💔 No tracks could be matched on the target service. Cannot create playlist.")
                else:
                    # 3. Create playlist on target
                    status_placeholder.info(f"➕ Creating playlist '{new_playlist_name}' on {target_service}...")
                    target_playlist_id = mock_create_playlist_on_target(new_playlist_name, target_service)

                    # 4. Add tracks to target playlist
                    status_placeholder.info(f"📲 Adding tracks to '{new_playlist_name}'...")
                    success = mock_add_tracks_to_target_playlist(
                        target_playlist_id, found_track_uris_on_target, target_service
                    )

                    if success:
                        status_placeholder.empty() # Clear the status message area
                        st.success(
                            f"🎉 Hooray! Successfully created playlist '{new_playlist_name}' ({target_playlist_id}) "
                            f"on {target_service} with {len(found_track_uris_on_target)} tracks!"
                        )
                        st.balloons()
                    else:
                        status_placeholder.error("❌ Failed to add tracks to the new playlist on the target service.")

# Display log messages
if st.session_state.messages:
    st.markdown("---")
    st.markdown("<h3>⚙️ Conversion Log:</h3>", unsafe_allow_html=True)
    for msg in st.session_state.messages:
        st.markdown(f"<div class='log-message {msg['role']}'>{msg['content']}</div>", unsafe_allow_html=True)


# Footer
st.markdown(
    """
    <div class='footer'>
        <p>Playlist Porter elegante &copy; 2025</p>
        <p>Powered by T3 Chat (Gemini 2.5 Pro Model) & Streamlit</p>
    </div>
    """,
    unsafe_allow_html=True
)

import streamlit as st
import time

# --- Mock API Functions (Same as before, for demonstration) ---
def mock_get_playlist_items(playlist_url, service_name):
    st.session_state.messages.append(
        {"role": "system", "content": f"Fetching tracks from {service_name} for: {playlist_url}"}
    )
    time.sleep(1)
    if "youtube.com" in playlist_url: # Basic check
        return [
            {"title": "Bohemian Rhapsody", "artist": "Queen", "album": "A Night at the Opera"},
            {"title": "Imagine", "artist": "John Lennon", "album": "Imagine"},
            {"title": "Shape of You", "artist": "Ed Sheeran", "album": "÷ (Divide)"},
            {"title": "NonExistent Song", "artist": "No One", "album": "Unknown Album"},
            {"title": "Another Brick in the Wall", "artist": "Pink Floyd", "album": "The Wall"},
        ]
    elif "spotify.com" in playlist_url: # Basic check
        return [
            {"title": "Stairway to Heaven", "artist": "Led Zeppelin", "album": "Led Zeppelin IV"},
            {"title": "Like a Rolling Stone", "artist": "Bob Dylan", "album": "Highway 61 Revisited"},
        ]
    elif "music.apple.com" in playlist_url: # Basic check
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
        {"role": "system", "content": f"Creating playlist '{playlist_name}' on {target_service_name}"}
    )
    time.sleep(0.5)
    return f"mock_playlist_id_{playlist_name.replace(' ', '_')}"

def mock_add_tracks_to_target_playlist(playlist_id, track_uris, target_service_name):
    st.session_state.messages.append(
        {"role": "system", "content": f"Adding {len(track_uris)} tracks to playlist {playlist_id} on {target_service_name}"}
    )
    time.sleep(1)
    return True

# --- Custom CSS for Apple-inspired Styling ---
APPLE_STYLE_CSS = """
body {
    background-color: #f5f5f7; /* Apple's light grey background */
    color: #1d1d1f; /* Apple's primary text color */
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

/* Main app container */
.main .block-container {
    max-width: 860px; /* Constrain width for focused content */
    margin: auto;
    padding-top: 3rem;
    padding-bottom: 3rem;
    padding-left: 1rem;
    padding-right: 1rem;
}

/* Title */
h1 {
    font-size: 2.8em; /* Slightly smaller than before, but still prominent */
    font-weight: 600;
    color: #1d1d1f;
    text-align: center;
    margin-bottom: 0.3em;
}
.stMarkdown p.app-subtitle { /* Custom class for subtitle */
    text-align: center;
    color: #6e6e73; /* Apple's secondary text color */
    font-size: 1.15em;
    margin-bottom: 3.5em;
    line-height: 1.5;
}

/* Section titles (h2) */
.stMarkdown h2 {
    font-size: 1.6em;
    font-weight: 600;
    color: #1d1d1f;
    margin-top: 0em; /* Adjusted as it's inside a card */
    margin-bottom: 1.2em;
    border-bottom: none; /* Remove previous border */
    display: flex;
    align-items: center;
}
.stMarkdown h2 .icon { /* Class for icons next to h2 */
    margin-right: 0.5em;
    font-size: 1.2em; /* Adjust icon size if needed */
}


/* Card styling */
.card {
    background-color: #ffffff;
    padding: 30px 35px;
    border-radius: 18px; /* Apple-like rounded corners */
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05), 0px 1px 3px rgba(0,0,0,0.08); /* Softer, more subtle shadow */
    margin-bottom: 30px;
    border: 1px solid #e5e5e5; /* Very light border */
    transition: box-shadow 0.3s ease-in-out, border-color 0.3s ease-in-out;
}
.card:hover {
    /* box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.07), 0px 2px 5px rgba(0,0,0,0.1); */
    /* border-color: #d1d1d1; */
    /* No hover effect for a cleaner look, or a very subtle one if preferred */
}


/* Input fields styling */
.stTextInput > div > label, .stSelectbox > label { /* Target labels specifically */
     color: #333333 !important;
     font-weight: 500 !important;
     font-size: 0.95em !important;
     margin-bottom: 8px !important;
}
.stTextInput > div > div > input,
.stSelectbox > div > div {
    background-color: #ffffff !important;
    color: #1d1d1f !important;
    border: 1px solid #d2d2d7 !important; /* Light grey border */
    border-radius: 8px !important;
    padding: 12px 15px !important; /* Adjusted padding */
    font-size: 1em !important;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.stTextInput > div > div > input:focus,
.stSelectbox > div > div:focus-within {
    border-color: #007aff !important; /* Apple blue focus */
    box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.15) !important;
}


/* Button styling */
div.stButton > button {
    background-color: #007aff; /* Apple blue */
    color: #ffffff;
    border: none;
    padding: 14px 30px; /* Slightly larger padding */
    border-radius: 8px; /* Standard Apple button radius */
    font-weight: 500; /* Medium weight */
    font-size: 1.05em;
    transition: background-color 0.2s ease;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05); /* Very subtle shadow */
    width: 100%;
}
div.stButton > button:hover {
    background-color: #005ec4; /* Darker blue on hover */
    box-shadow: 0 2px 4px rgba(0,0,0,0.07);
}
div.stButton > button:active {
    background-color: #004a99; /* Even darker on active */
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
}

/* Expander styling */
.stExpander {
    border: 1px solid #e0e0e0 !important;
    border-radius: 10px !important;
    background-color: #f9f9f9 !important; /* Slightly off-white */
    margin-top: 1em;
}
.stExpander header {
    font-weight: 500;
    font-size: 1em;
    color: #1d1d1f;
}
.stExpander header:hover {
    color: #007aff;
}
.stExpander div[data-testid="stExpanderDetails"] {
    padding: 0.5em 1em 1em 1em; /* Adjust padding inside expander */
}


/* Progress bar */
.stProgress > div > div > div > div {
    background-color: #007aff; /* Solid Apple blue */
}

/* Alert messages */
.stAlert {
    border-radius: 8px;
    font-weight: 400; /* Regular weight for alerts */
    padding: 12px 15px;
}
.stAlert.stAlert-success {
    background-color: #e6f6eb; /* Lighter green */
    border: 1px solid #c3e6cb;
    color: #155724;
}
.stAlert.stAlert-error {
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    color: #721c24;
}
.stAlert.stAlert-warning {
    background-color: #fff3cd;
    border: 1px solid #ffeeba;
    color: #856404;
}

/* Custom class for log messages */
.log-message {
    font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
    font-size: 0.9em;
    padding: 10px 12px;
    margin: 8px 0;
    border-radius: 6px;
    background-color: #e9e9eb; /* Light grey for logs */
    border-left: 3px solid #007aff;
    color: #333;
    line-height: 1.5;
}
.log-message.system { /* Keep if you differentiate roles */
    border-left-color: #007aff;
}

/* Footer */
.footer {
    text-align: center;
    padding: 30px 20px;
    font-size: 0.9em;
    color: #86868b; /* Apple's tertiary text color */
    border-top: 1px solid #e5e5e5;
    margin-top: 50px;
}
"""
st.markdown(f"<style>{APPLE_STYLE_CSS}</style>", unsafe_allow_html=True)

# --- Streamlit App UI ---

st.markdown("<h1>🎵 Playlist Porter</h1>", unsafe_allow_html=True)
st.markdown("<p class='app-subtitle'>Seamlessly transfer your music playlists across YouTube, Spotify, and Apple Music. <br>(UI/UX Demo)</p>", unsafe_allow_html=True)

if 'messages' not in st.session_state:
    st.session_state.messages = []

col1, col2 = st.columns(2)

with col1:
    st.markdown("<div class='card'>", unsafe_allow_html=True)
    st.markdown("<h2><span class='icon'>📤</span> Source Details</h2>", unsafe_allow_html=True)
    source_service = st.selectbox(
        "Select Source Service:",
        ("YouTube", "Spotify", "Apple Music"),
        key="source_service_apple" # Changed key to avoid conflict if running old code
    )
    source_playlist_url = st.text_input(
        f"Enter {source_service} Playlist URL or ID:",
        key="source_url_apple",
        placeholder=f"e.g., https://www.youtube.com/playlist?list=..."
    )
    st.markdown("</div>", unsafe_allow_html=True)

with col2:
    st.markdown("<div class='card'>", unsafe_allow_html=True)
    st.markdown("<h2><span class='icon'>📥</span> Target Details</h2>", unsafe_allow_html=True)
    target_service = st.selectbox(
        "Select Target Service:",
        ("Spotify", "YouTube", "Apple Music"),
        key="target_service_apple"
    )
    new_playlist_name = st.text_input(
        "Name for New Playlist on Target:",
        value="My Converted Playlist",
        key="target_playlist_name_apple"
    )
    st.markdown("</div>", unsafe_allow_html=True)

st.markdown("<br>", unsafe_allow_html=True)

if st.button("🚀 Convert Playlist Now", key="convert_button_apple"):
    st.session_state.messages = []
    if not source_playlist_url:
        st.error("❗ Please enter the source playlist URL.")
    elif source_service == target_service:
        st.warning("⚠️ Source and Target services cannot be the same.")
    else:
        st.markdown("---") # Simple separator
        status_placeholder = st.empty()

        with st.spinner(f"Initiating conversion from {source_service} to {target_service}..."):
            status_placeholder.info(f"📡 Fetching tracks from {source_service}...")
            source_tracks = mock_get_playlist_items(source_playlist_url, source_service)

            if not source_tracks:
                status_placeholder.error(f"❌ Could not fetch tracks from {source_playlist_url}. Please check the URL or ensure it's a valid playlist for the selected service.")
            else:
                status_placeholder.info(f"✅ Found {len(source_tracks)} tracks in the source playlist.")
                with st.expander("🔍 View Source Tracks"):
                    for i, track in enumerate(source_tracks):
                        st.write(f"{i+1}. {track['title']} – {track['artist']}")

                status_placeholder.info(f"🎶 Searching for tracks on {target_service}...")
                matched_tracks_info = []
                found_track_uris_on_target = []
                not_found_tracks = []

                progress_bar_container = st.empty() # Container for progress bar
                progress_text_container = st.empty() # Container for text below progress bar

                for i, track_info in enumerate(source_tracks):
                    target_track = mock_search_track_on_target(track_info, target_service)
                    if target_track:
                        matched_tracks_info.append(target_track)
                        found_track_uris_on_target.append(target_track["uri"])
                    else:
                        not_found_tracks.append(track_info)
                    
                    progress_percentage = (i + 1) / len(source_tracks)
                    progress_bar_container.progress(progress_percentage)
                    progress_text_container.caption(f"Processing: {track_info['title']} ({i+1}/{len(source_tracks)})")

                time.sleep(0.3) # Ensure last update is visible
                progress_bar_container.empty()
                progress_text_container.empty()

                status_placeholder.info(f"🎯 Found {len(found_track_uris_on_target)} matching tracks on {target_service}.")

                if not_found_tracks:
                    with st.expander(f"❓ {len(not_found_tracks)} tracks not found or matched on {target_service}"):
                        for track in not_found_tracks:
                            st.write(f"- {track['title']} – {track['artist']}")

                if not found_track_uris_on_target:
                    status_placeholder.warning("💔 No tracks could be matched on the target service. Cannot create playlist.")
                else:
                    status_placeholder.info(f"➕ Creating playlist '{new_playlist_name}' on {target_service}...")
                    target_playlist_id = mock_create_playlist_on_target(new_playlist_name, target_service)

                    status_placeholder.info(f"📲 Adding tracks to '{new_playlist_name}'...")
                    success = mock_add_tracks_to_target_playlist(
                        target_playlist_id, found_track_uris_on_target, target_service
                    )

                    if success:
                        status_placeholder.empty()
                        st.success(
                            f"🎉 Hooray! Successfully created playlist '{new_playlist_name}' ({target_playlist_id}) "
                            f"on {target_service} with {len(found_track_uris_on_target)} tracks!"
                        )
                        st.balloons()
                    else:
                        status_placeholder.error("❌ Failed to add tracks to the new playlist on the target service.")

if st.session_state.messages:
    st.markdown("<br>", unsafe_allow_html=True)
    st.markdown("<h3 style='font-weight: 500; font-size: 1.3em; color: #1d1d1f;'>⚙️ Conversion Log:</h3>", unsafe_allow_html=True)
    for msg in st.session_state.messages:
        st.markdown(f"<div class='log-message {msg['role']}'>{msg['content']}</div>", unsafe_allow_html=True)

st.markdown(
    """
    <div class='footer'>
        <p>Playlist Porter &copy; 2025</p>
        <p>UI/UX Demo inspired by Apple.com | Powered by T3 Chat & Streamlit</p>
    </div>
    """,
    unsafe_allow_html=True
)


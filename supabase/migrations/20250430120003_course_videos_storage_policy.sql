-- Let signed-in users read course videos (required for createSignedUrl with user JWT).
-- Create a private bucket in the Dashboard if needed, named like your env
-- NEXT_PUBLIC_COURSE_VIDEO_BUCKET (e.g. course-videos). If the name differs, edit below.

drop policy if exists "course_videos_select_authenticated" on storage.objects;

create policy "course_videos_select_authenticated"
on storage.objects for select
to authenticated
using (
  bucket_id in (select id from storage.buckets where name = 'course-videos')
);

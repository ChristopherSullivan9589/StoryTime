import json
import boto3
import re
import base64

def lambda_handler(event, context):
    s3 = boto3.client('s3')
    bucket_name = 'capstone-story-project'
    
    try:
        # Handle both API Gateway and direct invocation
        if 'body' in event:
            body = json.loads(event['body'])
        else:
            body = event
            
        # Handle both frontend formats
        story_name = body.get('name') or body.get('storyName')
        story_content = body.get('story') or body.get('storyContent')
        is_canvas = body.get('isCanvas', False)
        
        if not story_name or not story_content:
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Story name and content are required'})
            }
        
        # Check file type based on name or isCanvas flag
        if is_canvas or 'canvas' in story_name.lower():
            file_extension = '.png'
            content_type = 'image/png'
        elif 'character' in story_name.lower():
            file_extension = '.txt'
            content_type = 'text/plain'
        else:
            file_extension = '.txt'
            content_type = 'text/plain'
            
        # Just use the story name as provided (frontend handles suffixes)
        file_name = re.sub(r'[^a-zA-Z0-9-]', '_', story_name) + file_extension
        
        # Handle base64 decoding for canvas/image data
        if is_canvas or 'canvas' in story_name.lower():
            try:
                # Decode base64 image data
                body_data = base64.b64decode(story_content)
            except Exception as decode_error:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': f'Invalid base64 data: {str(decode_error)}'})
                }
        else:
            body_data = story_content
        
        s3.put_object(
            Bucket=bucket_name,
            Key=file_name,
            Body=body_data,
            ContentType=content_type
        )
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'message': 'Story saved successfully',
                'filename': file_name,
                'fileName': file_name,
                'file_name': file_name
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }